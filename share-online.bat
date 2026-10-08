@echo off
title Share Eco Chain Shipping Online
echo =====================================================================
echo    Eco Chain Shipping - Create Public Internet Link
echo =====================================================================
echo.
echo Make sure "start.bat" is running first!
echo Generating a public HTTPS URL so your friends can access it anywhere...
echo.

:: Get your public IP for the tunnel password
for /f %%a in ('curl -s https://loca.lt/mytunnelpassword') do set MY_IP=%%a

echo ---------------------------------------------------------------------
echo Tunnel Password / IP: %MY_IP%
echo (If prompted on the webpage, enter this password and click submit)
echo ---------------------------------------------------------------------
echo.

npx --yes localtunnel --port 5000
pause
