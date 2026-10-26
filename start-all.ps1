# PowerShell launcher for Bhakthi Printings
Write-Host "===================================================" -ForegroundColor DarkYellow
Write-Host "Starting Bhakthi Printings Backend & Frontend..." -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor DarkYellow

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir'; `$env:PYTHONPATH='backend'; .\backend\venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 2

# 2. Start Frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\frontend'; npm run dev"

Write-Host "Servers launched!" -ForegroundColor Green
Write-Host "Backend API:  http://127.0.0.1:8000 (Docs at /docs)" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Admin Portal: http://localhost:5173/admin" -ForegroundColor Cyan

