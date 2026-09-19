import math
from typing import Dict, Any, Tuple

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the Great Circle distance between two points in km."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

class MapsTool:
    @staticmethod
    def calculate_route(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float) -> Dict[str, Any]:
        """Calculates transit distance, duration, and optimal mode between two coordinates."""
        distance_km = haversine_distance(origin_lat, origin_lng, dest_lat, dest_lng)
        
        if distance_km <= 1.0:
            mode = "walking"
            speed_kmh = 4.5
            cost = 0.0
        elif distance_km <= 6.0:
            mode = "taxi"
            speed_kmh = 22.0
            cost = round(50 + distance_km * 20, 0)
        else:
            mode = "metro"
            speed_kmh = 35.0
            cost = round(20 + distance_km * 5, 0)
            
        duration_mins = max(5, int((distance_km / speed_kmh) * 60))
        
        return {
            "distance_km": distance_km,
            "duration_mins": duration_mins,
            "mode": mode,
            "cost": cost,
            "summary": f"{distance_km} km via {mode} (~{duration_mins} mins)"
        }
