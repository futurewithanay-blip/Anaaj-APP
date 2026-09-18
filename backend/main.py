import sys
from pathlib import Path

# Ensure both root directory and backend directory are in sys.path
backend_dir = Path(__file__).resolve().parent
root_dir = backend_dir.parent
for p in (str(backend_dir), str(root_dir)):
    if p not in sys.path:
        sys.path.insert(0, p)

import uvicorn
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

try:
    from backend.config import ALLOWED_ORIGINS, BACKEND_HOST, BACKEND_PORT
    from backend.services.agmarknet_client import fetch_live_mandi_prices
    from backend.services.forecasting_engine import generate_price_forecast
    from backend.services.storage_engine import calculate_storage_advisory
    from backend.services.weather_client import fetch_live_weather
except ImportError:
    from config import ALLOWED_ORIGINS, BACKEND_HOST, BACKEND_PORT
    from services.agmarknet_client import fetch_live_mandi_prices
    from services.forecasting_engine import generate_price_forecast
    from services.storage_engine import calculate_storage_advisory
    from services.weather_client import fetch_live_weather

app = FastAPI(
    title="Anaaj Real-World AI Advisory & Market API",
    description="Live Government Agmarknet Feeds, Machine Learning Price Forecasting & WDRA Storage Advisory",
    version="1.0.0"
)

# CORS Configuration for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class ForecastRequest(BaseModel):
    crop_name: str = Field(..., example="Onion")
    target_mandi: Optional[str] = Field("Lasalgaon", example="Lasalgaon")
    harvest_date: Optional[str] = Field("", example="2026-09-18")
    moisture_percent: Optional[float] = Field(12.0, example=11.5)
    grade: Optional[str] = Field("A", example="Grade A (Export Quality)")

class StorageRequest(BaseModel):
    crop: str = Field(..., example="Onion")
    volume_qtl: float = Field(..., example=80.0)
    current_price: float = Field(..., example=2650.0)
    expected_future_price: float = Field(..., example=3100.0)
    holding_months: Optional[int] = Field(2, example=2)
    use_wdra: Optional[bool] = Field(True, example=True)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "anaaj-ai-advisory-backend",
        "version": "1.0.0",
        "ready": True
    }

@app.get("/api/v1/mandi/live")
async def get_live_mandi(
    state: Optional[str] = Query(None, description="State name e.g. Maharashtra"),
    commodity: Optional[str] = Query(None, description="Commodity e.g. Onion, Wheat, Soybean"),
    limit: int = Query(50, ge=1, le=200)
):
    """
    Live Mandi Daily Agmarknet endpoint.
    Connects to Data.gov.in official feed with automatic caching and benchmark fallback.
    """
    try:
        data = await fetch_live_mandi_prices(state=state, commodity=commodity, limit=limit)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/weather/live")
async def get_live_weather(
    district: str = Query("Nashik", description="District name"),
    state: str = Query("Maharashtra", description="State name")
):
    """
    Live Weather & Agricultural Spoilage/Moisture Risk Telemetry.
    Powered by OpenWeatherMap API with real-time agricultural dockage risk.
    """
    try:
        data = await fetch_live_weather(district=district, state=state)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/forecast/predict")
async def predict_price_endpoint(req: ForecastRequest):
    """
    Multi-factor Machine Learning & Time-Series Price Prediction.
    Grounds against live Agmarknet, seasonal arrivals, MSP baseline, and moisture dockage.
    """
    try:
        forecast = await generate_price_forecast(
            crop_name=req.crop_name,
            target_mandi=req.target_mandi or "Lasalgaon",
            harvest_date_str=req.harvest_date or "",
            moisture_percent=req.moisture_percent or 12.0,
            grade=req.grade or "A"
        )
        return {"status": "success", "data": forecast}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/storage/recommend")
async def storage_advisory_endpoint(req: StorageRequest):
    """
    WDRA Warehouse & e-NWR Storage Economics Engine.
    Evaluates net profit: Sell Now vs Hold in Warehouse.
    """
    try:
        advisory = calculate_storage_advisory(
            crop=req.crop,
            volume_qtl=req.volume_qtl,
            current_price=req.current_price,
            expected_future_price=req.expected_future_price,
            holding_months=req.holding_months or 2,
            use_wdra=req.use_wdra if req.use_wdra is not None else True
        )
        return {"status": "success", "data": advisory}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host=BACKEND_HOST, port=BACKEND_PORT, reload=True)
