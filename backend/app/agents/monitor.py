from typing import Dict, Any, List, Tuple
from app.models import TripItinerary, DisruptionEvent
from app.tools.weather_tool import WeatherTool

class MonitoringAgent:
    def __init__(self):
        self.weather_tool = WeatherTool()

    def scan_trip_disruptions(self, trip: TripItinerary, simulated_event: str = None) -> Tuple[List[DisruptionEvent], List[str], List[Dict[str, Any]]]:
        disruptions: List[DisruptionEvent] = []
        reasoning = []
        tools_called = []

        weather = self.weather_tool.get_forecast(trip.destination)
        tools_called.append({"tool": "weather_check", "result": weather["condition"]})
        
        if simulated_event == "WEATHER_RAIN":
            adverse_weather = self.weather_tool.simulate_adverse_weather(trip.destination)
            reasoning.append(f"ALERT: Severe Weather Warning! {adverse_weather['condition']} detected for {trip.destination}.")
            
            # Find outdoor activities
            affected_ids = []
            for day in trip.days:
                for act in day.activities:
                    if not act.is_indoor and act.status == "confirmed":
                        affected_ids.append(act.id)
                        reasoning.append(f"Risk identified: Outdoor activity '{act.title}' on Day {day.day_number} is vulnerable to heavy rain.")
                        
            if affected_ids:
                disruptions.append(DisruptionEvent(
                    type="WEATHER_RAIN",
                    title="Heavy Rainstorm & Flash Warning",
                    description=f"{adverse_weather['condition']}. Outdoor venues at risk.",
                    affected_activity_ids=affected_ids,
                    severity="HIGH"
                ))

        elif simulated_event == "VENUE_CLOSED":
            # Target first outdoor or landmark activity
            target_act = None
            target_day = 1
            for day in trip.days:
                for act in day.activities:
                    if act.status == "confirmed":
                        target_act = act
                        target_day = day.day_number
                        break
                if target_act:
                    break
                    
            if target_act:
                reasoning.append(f"ALERT: Venue closure broadcast! '{target_act.title}' on Day {target_day} is unexpectedly closed for emergency maintenance.")
                disruptions.append(DisruptionEvent(
                    type="VENUE_CLOSED",
                    title=f"Venue Closure: {target_act.title}",
                    description=f"{target_act.title} is unavailable during scheduled hours.",
                    affected_activity_ids=[target_act.id],
                    severity="MEDIUM"
                ))

        elif simulated_event == "BUDGET_CUT":
            reasoning.append(f"ALERT: User budget adjustment requested. Current total trip cost ({trip.user_preferences.currency}{trip.total_cost}) exceeds target budget.")
            disruptions.append(DisruptionEvent(
                type="BUDGET_CUT",
                title="Budget Limit Threshold Reached",
                description="Needs replacement of high-cost activities with budget-friendly alternatives.",
                affected_activity_ids=[],
                severity="MEDIUM"
            ))

        return disruptions, reasoning, tools_called
