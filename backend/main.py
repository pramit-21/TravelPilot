
import sys
import os

# Ensure backend directory is in sys.path so 'app' package is always resolvable
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from app.models import UserPreferences, DisruptionRequest, ChatRequest, AgentResponse, ChatResponse, TripItinerary
from app.agents.orchestrator import AgentOrchestrator

app = FastAPI(
    title="TravelPilot Autonomous AI API",
    description="Multi-Agent AI Travel Planning, Disruption Monitoring, RAG, and Replanning Engine",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = AgentOrchestrator()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "TravelPilot Multi-Agent Backend",
        "agents": ["PlannerAgent", "OptimizerAgent", "MonitoringAgent", "ReplannerAgent"],
        "tools": ["MapsTool", "WeatherTool", "PlacesTool", "RAGTool"]
    }

@app.post("/api/trips/plan", response_model=AgentResponse)
def create_trip_plan(prefs: UserPreferences):
    try:
        return orchestrator.create_trip(prefs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trips/optimize", response_model=AgentResponse)
def optimize_trip(trip_id: Optional[str] = Query(None), body: Optional[Dict[str, Any]] = Body(None)):
    target_id = trip_id or (body.get("trip_id") if body else None)
    if not target_id:
        raise HTTPException(status_code=400, detail="trip_id is required as a query parameter or JSON body")
    try:
        return orchestrator.optimize_trip(target_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trips/disrupt", response_model=AgentResponse)
def handle_disruption(request: DisruptionRequest):
    try:
        return orchestrator.handle_disruption(request)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trips/chat", response_model=ChatResponse)
def chat_with_agent(req: ChatRequest):
    try:
        return orchestrator.process_chat(req.trip_id, req.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trips/{trip_id}", response_model=TripItinerary)
def get_trip(trip_id: str):
    trip = orchestrator.trips_db.get(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, app_dir=CURRENT_DIR)

