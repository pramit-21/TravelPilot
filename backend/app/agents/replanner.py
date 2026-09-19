import sys
import os

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from typing import Dict, Any, List, Tuple
from app.models import TripItinerary, DisruptionRequest, Activity, TransportSegment
from app.tools.places_tool import PlacesTool
from app.tools.maps_tool import MapsTool
from app.tools.rag_tool import RAGTool

class ReplannerAgent:
    def __init__(self):
        self.places_tool = PlacesTool()
        self.maps_tool = MapsTool()
        self.rag_tool = RAGTool()

    def handle_disruption(self, trip: TripItinerary, request: DisruptionRequest) -> Tuple[TripItinerary, List[str], List[Dict[str, Any]]]:
        reasoning = []
        tools_called = []
        
        reasoning.append(f"Replanning Agent activated for event: {request.disruption_type}.")
        
        if request.disruption_type == "WEATHER_RAIN":
            reasoning.append("RAG Querying indoor alternatives & weather-protected cultural attractions...")
            rag_docs = self.rag_tool.retrieve_context("indoor museum indoor shelter monsoon rain", trip.destination)
            tools_called.append({"tool": "rag_retrieval", "query": "indoor alternatives", "retrieved_count": len(rag_docs)})
            
            replaced_count = 0
            current_ids = {a.id for d in trip.days for a in d.activities}
            for day in trip.days:
                for idx, act in enumerate(day.activities):
                    if not act.is_indoor and act.status == "confirmed":
                        alt = self.places_tool.get_indoor_alternative(
                            trip.destination,
                            act.id,
                            exclude_place_ids=list(current_ids)
                        )
                        if alt:
                            orig_title = act.title
                            act.id = alt["id"]
                            act.title = alt["title"]
                            act.category = alt["category"]
                            act.description = f"[Weather Replacement] {alt['description']}"
                            act.lat = alt["lat"]
                            act.lng = alt["lng"]
                            act.location_name = alt["title"]
                            act.is_indoor = True
                            act.cost = alt["cost"]
                            act.opening_hours = alt["opening_hours"]
                            act.rating = alt["rating"]
                            act.status = "replaced"
                            current_ids.add(alt["id"])
                            
                            replaced_count += 1
                            reasoning.append(f"Day {day.day_number}: Replaced outdoor '{orig_title}' with indoor alternative '{act.title}' ({alt['category']}).")
                            
                            tools_called.append({"tool": "get_indoor_alternative", "replaced": orig_title, "with": act.title})
                            
            trip.health_status = "Replanned (Rain Adapted)"

        elif request.disruption_type == "VENUE_CLOSED":
            target_id = request.target_activity_id
            current_ids = {a.id for d in trip.days for a in d.activities}
            for day in trip.days:
                for idx, act in enumerate(day.activities):
                    # If target_id is matching, or if no target_id specified pick the first confirmed
                    if (target_id and act.id == target_id) or (not target_id and act.status == "confirmed"):
                        orig_title = act.title
                        alt = self.places_tool.get_indoor_alternative(
                            trip.destination,
                            act.id,
                            exclude_place_ids=list(current_ids)
                        )
                        if alt:
                            act.id = alt["id"]
                            act.title = alt["title"]
                            act.category = alt["category"]
                            act.description = f"[Closure Replacement] {alt['description']}"
                            act.lat = alt["lat"]
                            act.lng = alt["lng"]
                            act.location_name = alt["title"]
                            act.cost = alt["cost"]
                            act.status = "replaced"
                            current_ids.add(alt["id"])
                            reasoning.append(f"Replaced closed venue '{orig_title}' with nearby alternative '{act.title}'.")
                            tools_called.append({"tool": "places_search_alternative", "original": orig_title, "replacement": act.title})
                        else:
                            act.status = "cancelled"
                            reasoning.append(f"Cancelled activity '{orig_title}' as no direct venue match was found.")
                        if not target_id:
                            break
                if not target_id and any(a.status in ["replaced", "cancelled"] for a in day.activities):
                    break
            trip.health_status = "Replanned (Venue Closure Handled)"

        elif request.disruption_type == "BUDGET_CUT":
            target_budget = request.custom_budget_limit or (trip.budget * 0.75)
            reasoning.append(f"Reducing trip spend to meet new target budget: {trip.user_preferences.currency}{target_budget}.")
            
            trip.budget = target_budget
            current_cost = 0.0
            for day in trip.days:

                for act in day.activities:
                    if act.cost > 200 and act.status == "confirmed":
                        act.cost = round(act.cost * 0.5, 0)
                        act.description += " [Discounted / Budget Saver Entry]"
                        reasoning.append(f"Substituted high-tier entry ticket for '{act.title}' with standard saver ticket.")
                    current_cost += act.cost + (act.transport_to_next.cost if act.transport_to_next else 0)
            
            trip.total_cost = current_cost
            trip.remaining_budget = max(0.0, trip.budget - current_cost)
            trip.health_status = "Replanned (Budget Optimized)"

        # Recalculate totals
        total_cost = 0.0
        for day in trip.days:
            day_cost = sum(a.cost + (a.transport_to_next.cost if a.transport_to_next else 0) for a in day.activities)
            day.total_cost = day_cost
            total_cost += day_cost
            
        trip.total_cost = total_cost
        trip.remaining_budget = max(0.0, trip.budget - total_cost)
        
        reasoning.append(f"Replanning complete. Updated total trip cost: {trip.user_preferences.currency}{total_cost}.")
        return trip, reasoning, tools_called
