@echo off
cd /d "%~dp0"
start "" http://localhost:8000/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\serve.ps1" -Port 8000
