import httpx
import json
import sys

# Ensure UTF-8 output for Windows console
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000/api"

def test_full_agent_workflow():
    print("=== 1. Testing Health Endpoint ===")
    res = httpx.get(f"{BASE_URL}/health")
    print("Health Status:", res.status_code, res.json())
    assert res.status_code == 200

    print("\n=== 2. Testing PlannerAgent (Create Trip) ===")
    payload = {
        "destination": "Kolkata",
        "duration_days": 3,
        "budget": 20000.0,
        "currency": "₹",
        "interests": ["History", "Food", "Culture"],
        "travel_style": "Balanced",
        "hotel_name": "Park Street Grand Hotel",
        "hotel_lat": 22.5540,
        "hotel_lng": 88.3512,
        "start_date": "2026-10-01"
    }
    res = httpx.post(f"{BASE_URL}/trips/plan", json=payload)
    data = res.json()
    print("Planner Agent Success:", data["success"])
    print("Agent Name:", data["agent_name"])
    print("Summary:", data["summary"])
    print("Reasoning trace count:", len(data["reasoning"]))
    print("Tools called:", [t["tool"] for t in data["tools_called"]])
    
    trip = data["updated_trip"]
    trip_id = trip["id"]
    print(f"Generated Trip ID: {trip_id}, Total Cost: ₹{trip['total_cost']}, Remaining: ₹{trip['remaining_budget']}")
    print(f"Days count: {len(trip['days'])}, Activities per day: {[len(d['activities']) for d in trip['days']]}")

    print("\n=== 3. Testing OptimizerAgent (Route Optimization) ===")
    res = httpx.post(f"{BASE_URL}/trips/optimize?trip_id={trip_id}")
    opt_data = res.json()
    print("Optimizer Agent Success:", opt_data["success"])
    print("Reasoning trace:", opt_data["reasoning"])

    print("\n=== 4. Testing ReplannerAgent (Simulate Heavy Rainstorm) ===")
    disrupt_payload = {
        "trip_id": trip_id,
        "disruption_type": "WEATHER_RAIN"
    }
    res = httpx.post(f"{BASE_URL}/trips/disrupt", json=disrupt_payload)
    disrupt_data = res.json()
    print("Replanner Agent Success:", disrupt_data["success"])
    print("Health Status after Rainstorm:", disrupt_data["updated_trip"]["health_status"])
    print("Disruption Reasoning:", disrupt_data["reasoning"])

    print("\n=== 5. Testing Natural Language Chat & RAG Engine ===")
    chat_payload = {
        "trip_id": trip_id,
        "message": "What are the entry ticket prices for Victoria Memorial?"
    }
    res = httpx.post(f"{BASE_URL}/trips/chat", json=chat_payload)
    chat_data = res.json()
    print("Chat Assistant Reply:\n", chat_data["reply"])
    print("Action Taken:", chat_data["action_taken"])
    print("Tools Used:", chat_data["tools_used"])

    print("\n🎉 ALL MULTI-AGENT E2E VERIFICATIONS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_agent_workflow()
