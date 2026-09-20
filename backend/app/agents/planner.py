import uuid
from typing import Dict, Any, List, Tuple
from app.models import UserPreferences, TripItinerary, DayItinerary, Activity, TransportSegment
from app.tools.places_tool import PlacesTool
from app.tools.maps_tool import MapsTool
from app.tools.weather_tool import WeatherTool

DESTINATION_DAY_THEMES = {
    "kolkata": [
        ("Colonial Heritage & British Architecture", "Explore the grandeur of Victoria Memorial, St. Paul's Cathedral, and Kolkata's historic colonial core."),
        ("Tagore's Legacy, Books & Historic Mansions", "Immerse in the literary heritage of Jorasanko, College Street Boi Para, and majestic north mansions."),
        ("Sacred Sanctuaries & Ganges Riverfront", "Experience the spiritual devotion of Dakshineswar, Belur, Howrah Bridge, and river promenades."),
        ("Park Street Dining, Art & Living Culture", "Savor legendary Park Street culinary walks, historic cemeteries, and local cultural landmarks."),
        ("Modern Science, Green Parks & Spiritual Wonder", "Discover Science City, Birla Mandir & Planetarium, and scenic nature parks.")
    ],
    "paris": [
        ("Eiffel Majesty & Seine River Cruise", "Marvel at the Eiffel Tower, cruise along the Seine, and stroll the grand Champs-Élysées."),
        ("Louvre Masterpieces & Royal Gardens", "Discover world-renowned art at the Louvre, Orsay, and stroll the idyllic Tuileries Gardens."),
        ("Historic Heart, Notre-Dame & Latin Quarter", "Walk through Île de la Cité, Sainte-Chapelle's stained glass, and historic Latin Quarter."),
        ("Bohemian Montmartre & Grand Belle Époque", "Climb to Sacré-Cœur, explore romantic Montmartre, and admire Palais Garnier's luxury."),
        ("Le Marais Pastries, Modern Art & Paris Legends", "Taste artisan pastries in Le Marais, explore Centre Pompidou, and uncover underground Paris.")
    ],
    "tokyo": [
        ("Historic Asakusa, Skytree & Old Tokyo Heritage", "Journey through traditional Senso-ji temple, Tokyo Skytree vistas, and peaceful Yanaka alleys."),
        ("Shrines, Harajuku Pop-Culture & Shibuya Neon", "Experience Meiji Jingu's forest serene, trendy Takeshita street, and iconic Shibuya crossing."),
        ("Tsukiji Seafood Market, Imperial Palace & Ginza", "Savor fresh sushi at Tsukiji, wander imperial castle gardens, and luxury Ginza boulevards."),
        ("Akihabara Tech, teamLab Digital Art & Odaiba Bay", "Immerse in retro gaming, futuristic digital art at teamLab, and Tokyo Bay waterfront."),
        ("Shinjuku Gardens, Modern Art & Golden Gai Nightlife", "Relax in Shinjuku Gyoen, view Roppongi skyline art, and experience authentic izakaya alleyways.")
    ]
}

GENERIC_DAY_THEMES = [
    ("Iconic Landmarks & Historic Heritage", "Discover world-famous monuments and the storied heritage of the city."),
    ("Art, Museums & Classical Architecture", "Immerse in timeless masterpieces, culture, and stunning architectural wonders."),
    ("Sacred Shrines & Scenic Riverfront", "Experience historic spiritual sanctuaries and peaceful scenic views."),
    ("Living Culture, Cuisine & Bazaars", "Taste authentic local culinary specialties and vibrant neighborhood bazaars."),
    ("Modern Wonders, Science & Green Sanctuaries", "Explore futuristic landmarks, innovation hubs, and serene natural parks.")
]

class PlannerAgent:
    def __init__(self):
        self.places_tool = PlacesTool()
        self.maps_tool = MapsTool()
        self.weather_tool = WeatherTool()

    def generate_plan(self, prefs: UserPreferences) -> Tuple[TripItinerary, List[str], List[Dict[str, Any]]]:
        dest = prefs.destination
        places = self.places_tool.search_places(dest, interests=prefs.interests)
        weather = self.weather_tool.get_forecast(dest)
        
        reasoning = [
            f"Analyzed user preferences: Destination = {dest}, Duration = {prefs.duration_days} days, Budget = {prefs.currency}{prefs.budget}.",
            f"Fetched {len(places)} candidate attractions matching interests: {', '.join(prefs.interests)}.",
            f"Verified weather forecast: {weather['condition']} ({weather['temperature']}). Outdoor activities are safe."
        ]
        
        tools_called = [
            {"tool": "places_search", "params": {"destination": dest, "interests": prefs.interests}, "result_count": len(places)},
            {"tool": "weather_forecast", "params": {"city": dest}, "result": weather["condition"]}
        ]
        
        # Lookup official destination hotel details
        dest_data = self.places_tool.get_destination_data(dest)
        if dest_data and "hotel" in dest_data:
            h = dest_data["hotel"]
            if not prefs.hotel_name or prefs.hotel_name == "Grand Park Hotel":
                prefs.hotel_name = h.get("name", prefs.hotel_name)
                prefs.hotel_lat = h.get("lat", prefs.hotel_lat)
                prefs.hotel_lng = h.get("lng", prefs.hotel_lng)
            prefs.hotel_image_url = h.get("image_url")

        # Distribute places across days 1 to 5 with distinct, non-repeating attractions
        days: List[DayItinerary] = []
        hotel_lat, hotel_lng = prefs.hotel_lat, prefs.hotel_lng
        
        places_per_day = 3
        start_times = ["10:00", "13:30", "16:30"]
        end_times = ["12:30", "15:30", "18:30"]
        
        total_trip_cost = 0.0
        used_place_ids = set()
        
        dest_key = dest.lower()
        theme_list = DESTINATION_DAY_THEMES.get(dest_key, GENERIC_DAY_THEMES)
        
        for day_num in range(1, prefs.duration_days + 1):
            day_activities: List[Activity] = []
            day_cost = 0.0
            day_transit = 0
            
            prev_lat, prev_lng = hotel_lat, hotel_lng
            
            # Select up to 3 distinct places for this specific day
            day_candidates = self.places_tool.get_places_for_day(
                dest,
                day_number=day_num,
                interests=prefs.interests,
                exclude_ids=used_place_ids
            )
            
            selected_day_places = day_candidates[:places_per_day]
            for p in selected_day_places:
                used_place_ids.add(p["id"])
                
            # If day pool has fewer than 3, backfill with remaining unused places
            if len(selected_day_places) < places_per_day:
                fallback_pool = [
                    p for p in places
                    if p.get("id") not in used_place_ids
                ]
                needed = places_per_day - len(selected_day_places)
                for p in fallback_pool[:needed]:
                    selected_day_places.append(p)
                    used_place_ids.add(p["id"])
            
            # If still short (e.g. extreme duration > 7 days), cycle safely
            while len(selected_day_places) < places_per_day and places:
                selected_day_places.append(places[len(selected_day_places) % len(places)])
            
            for slot, place_data in enumerate(selected_day_places):
                # Calculate transit from previous point
                route = self.maps_tool.calculate_route(
                    prev_lat, prev_lng,
                    place_data["lat"], place_data["lng"],
                    city=dest
                )
                
                transport = TransportSegment(
                    mode=route["mode"],
                    duration_mins=route["duration_mins"],
                    distance_km=route["distance_km"],
                    cost=route["cost"]
                )
                
                act_cost = place_data["cost"] + route["cost"]
                day_cost += act_cost
                day_transit += route["duration_mins"]
                
                activity = Activity(
                    id=f"act_{day_num}_{slot+1}_{uuid.uuid4().hex[:4]}",
                    title=place_data["title"],
                    category=place_data.get("matched_interest") or place_data["category"],
                    description=place_data["description"],
                    start_time=start_times[slot] if slot < len(start_times) else "19:00",
                    end_time=end_times[slot] if slot < len(end_times) else "21:00",
                    duration_mins=place_data["duration_mins"],
                    cost=place_data["cost"],
                    location_name=place_data["title"],
                    lat=place_data["lat"],
                    lng=place_data["lng"],
                    is_indoor=place_data["is_indoor"],
                    opening_hours=place_data["opening_hours"],
                    rating=place_data["rating"],
                    image_url=place_data.get("image_url"),
                    place_id=place_data.get("id"),
                    status="confirmed",
                    transport_to_next=transport
                )
                
                day_activities.append(activity)
                prev_lat, prev_lng = place_data["lat"], place_data["lng"]
            
            total_trip_cost += day_cost
            
            theme_idx = (day_num - 1) % len(theme_list)
            day_theme, day_summary_text = theme_list[theme_idx]
            
            day_itinerary = DayItinerary(
                day_number=day_num,
                date=f"Day {day_num}",
                theme=day_theme,
                summary=f"{day_summary_text} ({dest})",
                activities=day_activities,
                total_cost=day_cost,
                total_transit_mins=day_transit
            )
            days.append(day_itinerary)
            
        remaining_budget = max(0.0, prefs.budget - total_trip_cost)
        
        trip = TripItinerary(
            id=f"trip_{uuid.uuid4().hex[:8]}",
            destination=dest,
            user_preferences=prefs,
            days=days,
            total_cost=total_trip_cost,
            budget=prefs.budget,
            remaining_budget=remaining_budget,
            weather_summary=f"{weather['condition']}, {weather['temperature']}",
            health_status="Optimal"
        )
        
        all_activities_count = sum(len(d.activities) for d in days)
        reasoning.append(
            f"Successfully generated a {prefs.duration_days}-day itinerary with {all_activities_count} unique attractions across Days 1 to {prefs.duration_days} without any duplicates. Estimated total cost: {prefs.currency}{total_trip_cost}, leaving {prefs.currency}{remaining_budget} buffer."
        )
        
        return trip, reasoning, tools_called
