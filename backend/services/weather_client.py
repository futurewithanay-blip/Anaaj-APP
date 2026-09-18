import httpx
import logging
from typing import Dict, Any, Optional
from backend.config import WEATHER_API_KEY

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("weather_client")

# Cache to avoid hammering weather APIs
_WEATHER_CACHE: Dict[str, Dict[str, Any]] = {}

# Coordinates for major Indian agricultural districts
DISTRICT_COORDINATES = {
    "nashik": {"lat": 19.9975, "lon": 73.7898},
    "prayagraj": {"lat": 25.4358, "lon": 81.8463},
    "indore": {"lat": 22.7196, "lon": 75.8577},
    "ludhiana": {"lat": 30.9010, "lon": 75.8573},
    "karnal": {"lat": 29.6857, "lon": 76.9905},
    "pune": {"lat": 18.5204, "lon": 73.8567},
    "latur": {"lat": 18.4088, "lon": 76.5604},
    "jaipur": {"lat": 26.9124, "lon": 75.7873},
    "rajkot": {"lat": 22.3039, "lon": 70.8022},
    "lucknow": {"lat": 26.8467, "lon": 80.9462},
    "varanasi": {"lat": 25.3176, "lon": 82.9739},
    "bhopal": {"lat": 23.2599, "lon": 77.4126},
    "ahmedabad": {"lat": 23.0225, "lon": 72.5714},
    "patna": {"lat": 25.5941, "lon": 85.1376},
}

def get_district_coords(district_name: str) -> Dict[str, float]:
    clean = district_name.lower().replace("apmc", "").replace("mandi", "").strip()
    for k, coords in DISTRICT_COORDINATES.items():
        if k in clean:
            return coords
    # Default to central India (Indore/Nashik belt)
    return {"lat": 21.1458, "lon": 79.0882}


async def fetch_live_weather(district: str = "Nashik", state: str = "Maharashtra") -> Dict[str, Any]:
    """
    Fetches real-time weather data.
    Attempts OpenWeatherMap using user's key first.
    If key is not yet activated (401) or times out, uses Open-Meteo live API as zero-downtime fallback.
    """
    dist_key = district.lower().strip()
    if dist_key in _WEATHER_CACHE:
        return _WEATHER_CACHE[dist_key]

    coords = get_district_coords(district)
    weather_data: Optional[Dict[str, Any]] = None

    # 1. Try OpenWeatherMap if user has key
    if WEATHER_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    params={
                        "lat": coords["lat"],
                        "lon": coords["lon"],
                        "appid": WEATHER_API_KEY,
                        "units": "metric"
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    temp = data.get("main", {}).get("temp", 28.0)
                    humidity = data.get("main", {}).get("humidity", 65)
                    weather_desc = data.get("weather", [{}])[0].get("description", "Clear")
                    rain = data.get("rain", {}).get("1h", 0.0)

                    weather_data = {
                        "source": "OpenWeatherMap Live",
                        "district": district,
                        "state": state,
                        "temperature_c": round(temp, 1),
                        "humidity_pct": humidity,
                        "conditions": weather_desc.title(),
                        "rainfall_mm": rain,
                        "is_raining": rain > 0 or "rain" in weather_desc.lower()
                    }
                    logger.info(f"OpenWeatherMap live fetch successful for {district}")
                else:
                    logger.warning(f"OpenWeatherMap returned {res.status_code} ({res.text[:80]}); switching to Open-Meteo.")
        except Exception as e:
            logger.warning(f"OpenWeatherMap error ({e}); switching to Open-Meteo.")

    # 2. Fallback to Open-Meteo Live API (High-precision open meteorological API)
    if not weather_data:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(
                    "https://api.open-meteo.com/v1/forecast",
                    params={
                        "latitude": coords["lat"],
                        "longitude": coords["lon"],
                        "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code",
                        "timezone": "Asia/Kolkata"
                    }
                )
                if res.status_code == 200:
                    curr = res.json().get("current", {})
                    temp = curr.get("temperature_2m", 27.5)
                    humidity = curr.get("relative_humidity_2m", 62)
                    precip = curr.get("precipitation", 0.0)

                    weather_data = {
                        "source": "Open-Meteo India Live Stream",
                        "district": district,
                        "state": state,
                        "temperature_c": round(temp, 1),
                        "humidity_pct": int(humidity),
                        "conditions": "Precipitation Forecast" if precip > 0 else "Partly Cloudy / Normal",
                        "rainfall_mm": round(precip, 1),
                        "is_raining": precip > 0
                    }
        except Exception as e:
            logger.warning(f"Open-Meteo fallback failed ({e}); using regional standard.")

    # 3. Ultimate seasonal default fallback
    if not weather_data:
        weather_data = {
            "source": "Regional Agricultural Baseline",
            "district": district,
            "state": state,
            "temperature_c": 29.0,
            "humidity_pct": 60,
            "conditions": "Fair / Seasonal",
            "rainfall_mm": 0.0,
            "is_raining": False
        }

    # Compute Agricultural Risk & Moisture Advisory
    h = weather_data["humidity_pct"]
    r = weather_data["rainfall_mm"]

    if r > 2.0 or h > 80:
        weather_data["risk_level"] = "HIGH"
        weather_data["moisture_penalty_pct"] = 4.5
        weather_data["advisory"] = (
            f"High humidity ({h}%) or rainfall ({r}mm) detected in {district}. "
            f"Open mandi arrivals risk a 4-5% moisture dockage. Immediate deposit in WDRA covered storage recommended."
        )
    elif h > 70:
        weather_data["risk_level"] = "MODERATE"
        weather_data["moisture_penalty_pct"] = 2.0
        weather_data["advisory"] = (
            f"Moderate ambient humidity ({h}%). Dry thoroughly before spot sale or utilize aerated storage."
        )
    else:
        weather_data["risk_level"] = "LOW"
        weather_data["moisture_penalty_pct"] = 0.0
        weather_data["advisory"] = (
            f"Favorable dry weather ({weather_data['temperature_c']}°C, {h}% RH) in {district}. Optimal quality for trade."
        )

    _WEATHER_CACHE[dist_key] = weather_data
    return weather_data
