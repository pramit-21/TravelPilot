from typing import Dict, Any

class WeatherTool:
    @staticmethod
    def get_forecast(city: str, date_str: str = "2026-10-01") -> Dict[str, Any]:
        """Fetches weather forecast for a given city and date."""
        city_lower = city.lower()
        if "kolkata" in city_lower:
            return {
                "city": city,
                "temperature": "29°C",
                "condition": "Partly Cloudy",
                "rain_probability_percent": 15,
                "uv_index": "Moderate",
                "is_adverse": False
            }
        elif "paris" in city_lower:
            return {
                "city": city,
                "temperature": "18°C",
                "condition": "Mild Sunshine",
                "rain_probability_percent": 10,
                "uv_index": "Low",
                "is_adverse": False
            }
        else:
            return {
                "city": city,
                "temperature": "24°C",
                "condition": "Clear",
                "rain_probability_percent": 5,
                "uv_index": "Normal",
                "is_adverse": False
            }

    @staticmethod
    def simulate_adverse_weather(city: str) -> Dict[str, Any]:
        """Simulates sudden severe weather disruption (e.g. torrential rain storm)."""
        return {
            "city": city,
            "temperature": "25°C",
            "condition": "Heavy Rainstorm & Thunderstorms",
            "rain_probability_percent": 95,
            "warning": "High wind alert & heavy rainfall expected for outdoor locations.",
            "is_adverse": True
        }
