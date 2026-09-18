import os
from pathlib import Path
from dotenv import load_dotenv

# Explicitly load backend/.env and fallback to root .env
backend_env = Path(__file__).resolve().parent / ".env"
root_env = Path(__file__).resolve().parent.parent / ".env"

if backend_env.exists():
    load_dotenv(dotenv_path=backend_env)
elif root_env.exists():
    load_dotenv(dotenv_path=root_env)
else:
    load_dotenv()

DATA_GOV_IN_API_KEY = os.getenv("DATA_GOV_IN_API_KEY", "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "")
BACKEND_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))

raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
if raw_origins.strip() == "*":
    ALLOWED_ORIGINS = ["*"]
else:
    ALLOWED_ORIGINS = [
        origin.strip() 
        for origin in raw_origins.split(",")
        if origin.strip()
    ]

