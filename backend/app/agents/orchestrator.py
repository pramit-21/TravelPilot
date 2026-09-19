from typing import Dict, Any, List, Optional
from app.models import UserPreferences, TripItinerary, DisruptionRequest, AgentResponse, ChatResponse
from app.agents.planner import PlannerAgent
from app.agents.optimizer import OptimizerAgent
from app.agents.monitor import MonitoringAgent
from app.agents.replanner import ReplannerAgent
from app.tools.rag_tool import RAGTool

class AgentOrchestrator:
    def __init__(self):
        self.planner = PlannerAgent()
        self.optimizer = OptimizerAgent()
        self.monitor = MonitoringAgent()
        self.replanner = ReplannerAgent()
        self.rag = RAGTool()

        # In-memory session store
        self.trips_db: Dict[str, TripItinerary] = {}

    def create_trip(self, prefs: UserPreferences) -> AgentResponse:
        trip, reasoning, tools = self.planner.generate_plan(prefs)
        self.trips_db[trip.id] = trip
        
        return AgentResponse(
            agent_name="PlannerAgent",
            success=True,
            summary=f"Successfully generated a {prefs.duration_days}-day AI itinerary for {prefs.destination}.",
            reasoning=reasoning,
            actions_taken=["Analyzed preferences", "Queried places & maps tools", "Synthesized day-by-day plan"],
            tools_called=tools,
            updated_trip=trip
        )

    def optimize_trip(self, trip_id: str) -> AgentResponse:
        trip = self.trips_db.get(trip_id)
        if not trip:
            raise ValueError("Trip not found")
            
        opt_trip, reasoning, tools = self.optimizer.optimize_itinerary(trip)
        self.trips_db[trip_id] = opt_trip
        
        return AgentResponse(
            agent_name="OptimizerAgent",
            success=True,
            summary="Optimized transit routes & activity sequence to minimize travel time.",
            reasoning=reasoning,
            actions_taken=["Calculated haversine distances", "Optimized venue sequencing", "Updated transport metrics"],
            tools_called=tools,
            updated_trip=opt_trip
        )

    def handle_disruption(self, request: DisruptionRequest) -> AgentResponse:
        trip = self.trips_db.get(request.trip_id)
        if not trip:
            raise ValueError("Trip not found")
            
        # Scan disruptions
        disruptions, scan_reasoning, scan_tools = self.monitor.scan_trip_disruptions(trip, request.disruption_type)
        
        # Execute replanning
        replan_trip, replan_reasoning, replan_tools = self.replanner.handle_disruption(trip, request)
        self.trips_db[request.trip_id] = replan_trip
        
        combined_reasoning = scan_reasoning + replan_reasoning
        combined_tools = scan_tools + replan_tools
        
        return AgentResponse(
            agent_name="ReplannerAgent",
            success=True,
            summary=f"Autonomous Replanning completed for event: {request.disruption_type}.",
            reasoning=combined_reasoning,
            actions_taken=["Scanned disruption impact", "Queried RAG for indoor alternatives", "Updated trip itinerary graph"],
            tools_called=combined_tools,
            updated_trip=replan_trip
        )

    def process_chat(self, trip_id: str, message: str) -> ChatResponse:
        trip = self.trips_db.get(trip_id)
        msg_lower = message.lower()
        
        if "rain" in msg_lower or "weather" in msg_lower:
            req = DisruptionRequest(trip_id=trip_id, disruption_type="WEATHER_RAIN")
            res = self.handle_disruption(req)
            return ChatResponse(
                reply="I detected rain concerns in your prompt. I have automatically replanned outdoor activities with indoor alternatives using the Replanning Agent!",
                action_taken="WEATHER_RAIN_REPLAN",
                tools_used=["weather_tool", "rag_tool", "places_tool"],
                updated_trip=res.updated_trip
            )
        elif "budget" in msg_lower or "cheaper" in msg_lower or "cost" in msg_lower:
            req = DisruptionRequest(trip_id=trip_id, disruption_type="BUDGET_CUT")
            res = self.handle_disruption(req)
            return ChatResponse(
                reply="I have recalibrated your itinerary to lower total cost and stay within budget preferences.",
                action_taken="BUDGET_CUT_REPLAN",
                tools_used=["budget_calculator", "places_tool"],
                updated_trip=res.updated_trip
            )
        else:
            # Query RAG for general questions
            dest = trip.destination if trip else "Kolkata"
            context = self.rag.retrieve_context(message, dest)
            context_str = " ".join(context) if context else "No direct matching knowledge base entries found."
            
            return ChatResponse(
                reply=f"Based on TravelPilot RAG Knowledge Base for {dest}:\n\n{context_str}\n\nCan I help you add or reschedule an activity for your trip?",
                action_taken="RAG_QUERY",
                tools_used=["rag_retriever", "places_database"],
                updated_trip=trip
            )
