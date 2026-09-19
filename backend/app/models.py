from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class TransportSegment(BaseModel):
    mode: str = "taxi"  # taxi, walking, metro, bus
    duration_mins: int = 15
    distance_km: float = 3.5
    cost: float = 150.0

class Activity(BaseModel):
    id: str
    title: str
    category: str  # Historical, Food, Nature, Museum, Shopping, Entertainment, Relax
    description: str
    start_time: str  # e.g., "10:00"
    end_time: str    # e.g., "12:30"
    duration_mins: int = 120
    cost: float = 0.0
    location_name: str
    lat: float
    lng: float
    is_indoor: bool = False
    opening_hours: str = "09:00 - 18:00"
    rating: float = 4.5
    image_url: Optional[str] = None
    place_id: Optional[str] = None
    status: str = "confirmed"  # confirmed, cancelled, replaced, delayed
    transport_to_next: Optional[TransportSegment] = None

class DayItinerary(BaseModel):
    day_number: int
    date: str
    theme: str
    summary: str
    activities: List[Activity] = []
    total_cost: float = 0.0
    total_transit_mins: int = 0

class UserPreferences(BaseModel):
    destination: str = "Kolkata"
    duration_days: int = 3
    budget: float = 20000.0
    currency: str = "₹"
    interests: List[str] = ["History", "Food", "Culture"]
    travel_style: str = "Balanced"  # Fast-paced, Balanced, Relaxed
    hotel_name: str = "Grand Park Hotel"
    hotel_lat: float = 22.5540
    hotel_lng: float = 88.3512
    start_date: str = "2026-10-01"

class TripItinerary(BaseModel):
    id: str
    destination: str
    user_preferences: UserPreferences
    days: List[DayItinerary] = []
    total_cost: float = 0.0
    budget: float = 20000.0
    remaining_budget: float = 0.0
    weather_summary: str = "Sunny and clear, 28°C"
    health_status: str = "Optimal"  # Optimal, Disrupted, Replanned
    last_updated: str = Field(default_factory=lambda: datetime.now().isoformat())

class DisruptionEvent(BaseModel):
    type: str  # "WEATHER_RAIN", "VENUE_CLOSED", "BUDGET_CUT", "TRAFFIC_JAM"
    title: str
    description: str
    affected_activity_ids: List[str] = []
    severity: str = "MEDIUM"  # LOW, MEDIUM, HIGH

class DisruptionRequest(BaseModel):
    trip_id: str
    disruption_type: str  # "WEATHER_RAIN", "VENUE_CLOSED", "BUDGET_CUT", "TRAFFIC_JAM"
    target_day: int = 1
    target_activity_id: Optional[str] = None
    custom_budget_limit: Optional[float] = None
    description: Optional[str] = None

class AgentResponse(BaseModel):
    agent_name: str  # "PlannerAgent", "OptimizerAgent", "MonitorAgent", "ReplannerAgent"
    success: bool
    summary: str
    reasoning: List[str]
    actions_taken: List[str]
    tools_called: List[Dict[str, Any]]
    updated_trip: TripItinerary

class ChatRequest(BaseModel):
    trip_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str
    action_taken: Optional[str] = None
    tools_used: List[str] = []
    updated_trip: Optional[TripItinerary] = None
