import json
import os
from typing import List, Dict, Any, Optional

class PlacesTool:
    def __init__(self, data_path: Optional[str] = None):
        if not data_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, "data", "destinations_knowledge.json")
        
        with open(data_path, "r", encoding="utf-8") as f:
            self.knowledge = json.load(f)

    def get_destination_data(self, destination: str) -> Optional[Dict[str, Any]]:
        dest_key = destination.lower()
        return self.knowledge.get(dest_key, self.knowledge.get("kolkata"))

    def search_places(
        self,
        destination: str,
        interests: Optional[List[str]] = None,
        is_indoor_only: bool = False
    ) -> List[Dict[str, Any]]:
        dest_data = self.get_destination_data(destination)
        if not dest_data:
            return []

        places = dest_data.get("places", [])
        filtered = []
        for place in places:
            if is_indoor_only and not place.get("is_indoor", False):
                continue
            filtered.append(place)
        return filtered

    def get_indoor_alternative(
        self,
        destination: str,
        target_place_id: str,
        exclude_place_ids: Optional[List[str]] = None
    ) -> Optional[Dict[str, Any]]:
        dest_data = self.get_destination_data(destination)
        if not dest_data:
            return None
        
        places = dest_data.get("places", [])
        exclude_set = set(exclude_place_ids or [])
        exclude_set.add(target_place_id)
        
        # Look for indoor venue not currently excluded or scheduled
        for p in places:
            if p.get("is_indoor", False) and p["id"] not in exclude_set:
                return p
        
        # Fallback to any indoor venue other than target if everything is excluded
        for p in places:
            if p.get("is_indoor", False) and p["id"] != target_place_id:
                return p
        return None

