@echo off
title Push Eco Chain Shipping to GitHub
echo =====================================================================
echo    Push Eco Chain Shipping to GitHub
echo =====================================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g., https://github.com/username/repo.git): "
echo.
echo Linking repository to: %REPO_URL% ...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo.
echo Pushing code to branch 'main'...
git push -u origin main
echo.
echo =====================================================================
echo Done! If successful, refresh your GitHub repo page to see your files.
echo =====================================================================
pause
