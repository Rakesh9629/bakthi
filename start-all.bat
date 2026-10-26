@echo off
title Launch Bhakthi Printings
echo ===================================================
echo Launching Bhakthi Printings Backend & Frontend...
echo ===================================================
cd /d "%~dp0"
start "Bhakthi Printings - Backend API" run-backend.bat
timeout /t 2 /nobreak >nul
start "Bhakthi Printings - Storefront" run-frontend.bat
echo Both services launched!
echo Backend:    http://127.0.0.1:8000
echo Frontend:   http://localhost:5173
echo Admin:      http://localhost:5173/admin

