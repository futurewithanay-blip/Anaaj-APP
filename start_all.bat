@echo off
title Anaaj / AgriNova - Full Stack Live System
color 0A

echo =====================================================================
echo       AgriNova / Anaaj - Live Real-World AI & Data Engine
echo =====================================================================
echo [1/3] Checking Python Virtual Environment...
if not exist "backend\.venv\Scripts\python.exe" (
    echo [ERROR] backend\.venv not found! Creating virtual environment...
    python -m venv backend\.venv
    call backend\.venv\Scripts\activate.bat
    pip install -r backend\requirements.txt
) else (
    echo [OK] backend\.venv found!
)

echo.
echo [2/3] Starting FastAPI ML Microservice on http://127.0.0.1:8000...
start "AgriNova FastAPI Backend [Port 8000]" cmd /k "backend\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo.
echo [3/3] Starting Vite React Frontend Dashboard...
echo Open your browser at http://localhost:5173 or http://localhost:3000
echo.
npm run dev

pause
