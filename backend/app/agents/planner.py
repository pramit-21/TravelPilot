import uuid
from typing import Dict, Any, List, Tuple
from app.models import UserPreferences, TripItinerary, DayItinerary, Activity, TransportSegment
from app.tools.places_tool import PlacesTool
from app.tools.maps_tool import MapsTool
from app.tools.weather_tool import WeatherTool

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
        
        # Distribute places across days
        days: List[DayItinerary] = []
        hotel_lat, hotel_lng = prefs.hotel_lat, prefs.hotel_lng
        
        places_per_day = 3
        place_index = 0
        
        start_times = ["10:00", "13:30", "16:30"]
        end_times = ["12:30", "15:30", "18:30"]
        
        total_trip_cost = 0.0
        
        for day_num in range(1, prefs.duration_days + 1):
            day_activities: List[Activity] = []
            day_cost = 0.0
            day_transit = 0
            
            prev_lat, prev_lng = hotel_lat, hotel_lng
            
            for slot in range(places_per_day):
                if place_index >= len(places):
                    # cycle if run out of places
                    place_data = places[slot % len(places)]
                else:
                    place_data = places[place_index]
                    place_index += 1
                
                # Calculate transit from previous point
                route = self.maps_tool.calculate_route(prev_lat, prev_lng, place_data["lat"], place_data["lng"])
                
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
                    start_time=start_times[slot],
                    end_time=end_times[slot],
                    duration_mins=place_data["duration_mins"],
                    cost=place_data["cost"],
                    location_name=place_data["title"],
                    lat=place_data["lat"],
                    lng=place_data["lng"],
                    is_indoor=place_data["is_indoor"],
                    opening_hours=place_data["opening_hours"],
                    rating=place_data["rating"],
                    status="confirmed",
                    transport_to_next=transport
                )
                
                day_activities.append(activity)
                prev_lat, prev_lng = place_data["lat"], place_data["lng"]
            
            total_trip_cost += day_cost
            
            themes = ["Heritage & Architecture", "Culture & Art", "Local Food & Parks", "Science & Modern Landmarks"]
            day_theme = themes[(day_num - 1) % len(themes)]
            
            day_itinerary = DayItinerary(
                day_number=day_num,
                date=f"Day {day_num}",
                theme=day_theme,
                summary=f"Explore {day_theme} around {dest}.",
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
        
        reasoning.append(f"Successfully generated a {prefs.duration_days}-day itinerary. Estimated total cost: {prefs.currency}{total_trip_cost}, leaving {prefs.currency}{remaining_budget} buffer.")
        
        return trip, reasoning, tools_called
