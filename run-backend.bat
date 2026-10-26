@echo off
title Bhakthi Printings - FastAPI Backend
echo ===================================================
echo Starting Bhakthi Printings FastAPI Backend...
echo Connecting to Neon PostgreSQL cloud database...
echo API Docs will be available at: http://127.0.0.1:8000/docs
echo ===================================================
cd /d "%~dp0"
set PYTHONPATH=backend
backend\venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
pause

