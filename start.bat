@echo off
title Eco Chain Shipping - Blockchain System
echo =====================================================================
echo    Eco Chain Shipping - Blockchain Management System
echo    Starting server on http://localhost:5000 ...
echo =====================================================================
echo.

:: Wait 2 seconds and launch default web browser
timeout /t 2 /nobreak >nul
start "" http://localhost:5000

:: Launch Node.js server
node server/index.js

pause
