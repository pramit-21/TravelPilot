import json
import os
from typing import List, Dict, Any, Optional

INTEREST_RULES = {
    "history": {
        "cats": ["historical", "history"],
        "tags": ["history", "heritage", "historical", "monument", "temple", "palace", "mansion"]
    },
    "food": {
        "cats": ["food"],
        "tags": ["food", "dining", "culinary", "market", "kebabs", "patisserie", "ramen", "sushi", "bistro", "cafe", "street food"]
    },
    "culture": {
        "cats": ["culture", "cultural"],
        "tags": ["culture", "cultural", "spiritual", "temple", "shrine", "heritage", "tradition", "buddhist"]
    },
    "museums": {
        "cats": ["museum", "science / museum"],
        "tags": ["museum", "museums", "exhibits", "antiques", "planetarium", "science"]
    },
    "nature": {
        "cats": ["nature"],
        "tags": ["nature", "gardens", "garden", "park", "river", "lake", "zen garden", "trees"]
    },
    "landmarks": {
        "cats": ["landmark"],
        "tags": ["landmark", "landmarks", "tower", "bridge", "monument", "architecture", "square"]
    },
    "art": {
        "cats": ["art"],
        "tags": ["art", "gallery", "paintings", "masterpieces", "sculpture", "exhibition", "creative"]
    }
}

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

    def _match_place_interest(self, place: Dict[str, Any], interests: List[str]) -> Optional[str]:
        cat = place.get("category", "").lower()
        tags = [t.lower() for t in place.get("tags", [])]
        title = place.get("title", "").lower()
        desc = place.get("description", "").lower()

        for interest in interests:
            norm = interest.lower()
            rules = INTEREST_RULES.get(norm, {"cats": [norm], "tags": [norm]})
            if any(c in cat for c in rules["cats"]) or any(t in tags for t in rules["tags"]):
                return interest
            if norm in title or norm in desc:
                return interest
        return None

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
        
        # If specific interests provided, match and prioritize places for those interests
        if interests:
            matched_places = []
            for place in places:
                if is_indoor_only and not place.get("is_indoor", False):
                    continue
                
                matched_interest = self._match_place_interest(place, interests)
                if matched_interest:
                    p_copy = dict(place)
                    p_copy["matched_interest"] = matched_interest
                    matched_places.append(p_copy)
            
            if matched_places:
                return matched_places

        # Fallback if no matching places found or no interests specified
        filtered = []
        for place in places:
            if is_indoor_only and not place.get("is_indoor", False):
                continue
            filtered.append(dict(place))
        return filtered

    def get_indoor_alternative(
        self,
        destination: str,
        target_place_id: str,
        exclude_place_ids: Optional[List[str]] = None,
        interests: Optional[List[str]] = None
    ) -> Optional[Dict[str, Any]]:
        dest_data = self.get_destination_data(destination)
        if not dest_data:
            return None
        
        places = dest_data.get("places", [])
        exclude_set = set(exclude_place_ids or [])
        exclude_set.add(target_place_id)
        
        # If user has preferred interests, try finding indoor venue matching interests first
        if interests:
            for p in places:
                if p.get("is_indoor", False) and p["id"] not in exclude_set:
                    matched_interest = self._match_place_interest(p, interests)
                    if matched_interest:
                        p_copy = dict(p)
                        p_copy["matched_interest"] = matched_interest
                        return p_copy

        # Look for indoor venue not currently excluded or scheduled
        for p in places:
            if p.get("is_indoor", False) and p["id"] not in exclude_set:
                return dict(p)
        
        # Fallback to any indoor venue other than target if everything is excluded
        for p in places:
            if p.get("is_indoor", False) and p["id"] != target_place_id:
                return dict(p)
        return None
