import json
import os
import re
from typing import List, Dict, Any

class RAGTool:
    """Vector RAG search tool for retrieving destination knowledge, policies, and local tips."""
    def __init__(self, data_path: str = None):
        if not data_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, "data", "destinations_knowledge.json")
            
        with open(data_path, "r", encoding="utf-8") as f:
            self.knowledge = json.load(f)

    def retrieve_context(self, query: str, destination: str = "Kolkata") -> List[str]:
        dest_data = self.knowledge.get(destination.lower(), self.knowledge.get("kolkata"))
        if not dest_data:
            return []

        snippets = dest_data.get("rag_context", [])
        places = dest_data.get("places", [])
        
        # Add place descriptions into indexable snippets
        for place in places:
            snippets.append(
                f"{place['title']} ({place['category']}): {place['description']} "
                f"Opening hours: {place['opening_hours']}. Entry cost: ₹{place['cost']}."
            )

        query_words = set(re.findall(r'\w+', query.lower()))
        
        scored_snippets = []
        for snippet in snippets:
            snippet_words = set(re.findall(r'\w+', snippet.lower()))
            overlap = len(query_words.intersection(snippet_words))
            scored_snippets.append((overlap, snippet))
            
        scored_snippets.sort(key=lambda x: x[0], reverse=True)
        return [s[1] for s in scored_snippets[:4] if s[0] > 0] or snippets[:3]
