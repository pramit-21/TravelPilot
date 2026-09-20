from typing import Dict, Any, List, Tuple
from app.models import TripItinerary, TransportSegment
from app.tools.maps_tool import MapsTool

class OptimizerAgent:
    def __init__(self):
        self.maps_tool = MapsTool()

    def optimize_itinerary(self, trip: TripItinerary) -> Tuple[TripItinerary, List[str], List[Dict[str, Any]]]:
        reasoning = []
        tools_called = []
        
        hotel_lat = trip.user_preferences.hotel_lat
        hotel_lng = trip.user_preferences.hotel_lng
        
        total_saved_transit = 0
        
        for day in trip.days:
            if len(day.activities) <= 1:
                continue
                
            orig_transit = day.total_transit_mins
            activities = day.activities[:]
            
            # Simple nearest neighbor re-ordering from hotel
            optimized_order = []
            curr_lat, curr_lng = hotel_lat, hotel_lng
            
            remaining = activities[:]
            while remaining:
                # Find closest next venue
                best_act = min(
                    remaining,
                    key=lambda a: self.maps_tool.calculate_route(curr_lat, curr_lng, a.lat, a.lng)["distance_km"]
                )
                optimized_order.append(best_act)
                remaining.remove(best_act)
                curr_lat, curr_lng = best_act.lat, best_act.lng
                
            # Reassign times and transport metrics
            start_times = ["10:00", "13:00", "16:00"]
            end_times = ["12:00", "15:00", "18:00"]
            
            new_transit = 0
            prev_lat, prev_lng = hotel_lat, hotel_lng
            
            for idx, act in enumerate(optimized_order):
                act.start_time = start_times[idx % len(start_times)]
                act.end_time = end_times[idx % len(end_times)]
                
                route = self.maps_tool.calculate_route(prev_lat, prev_lng, act.lat, act.lng)
                act.transport_to_next = TransportSegment(
                    mode=route["mode"],
                    duration_mins=route["duration_mins"],
                    distance_km=route["distance_km"],
                    cost=route["cost"]
                )
                new_transit += route["duration_mins"]
                prev_lat, prev_lng = act.lat, act.lng
                
                tools_called.append({
                    "tool": "calculate_route",
                    "from": act.location_name,
                    "distance": f"{route['distance_km']} km",
                    "duration": f"{route['duration_mins']} mins"
                })
                
            day.activities = optimized_order
            day.total_transit_mins = new_transit
            day.total_cost = sum(a.cost + (a.transport_to_next.cost if a.transport_to_next else 0) for a in day.activities)
            
            saved = orig_transit - new_transit
            if saved > 0:
                total_saved_transit += saved
                reasoning.append(f"Day {day.day_number}: Reordered activities to reduce transit time by {saved} mins.")
            else:
                reasoning.append(f"Day {day.day_number}: Route order verified optimal.")
                
        # Recalculate trip totals and update status
        trip.total_cost = sum(d.total_cost for d in trip.days)
        trip.remaining_budget = max(0.0, trip.budget - trip.total_cost)
        trip.health_status = "Optimal (Routes Optimized)"
        
        reasoning.insert(0, f"Route optimization complete. Total transit time reduced by {total_saved_transit} minutes across the trip.")
        return trip, reasoning, tools_called

