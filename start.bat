@echo off
echo ==============================================
echo   Starting TravelPilot Multi-Agent Application
echo ==============================================
echo.

echo 1. Starting FastAPI Backend on http://localhost:8000 ...
start "TravelPilot Backend" cmd /k "cd /d %~dp0 && python backend/main.py"

echo 2. Starting Vite React Frontend on http://localhost:8080 ...
start "TravelPilot Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo 3. Automatically launching browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:8080

echo.
echo Both servers are launching and browser has been opened!
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:8000/docs
echo ==============================================
