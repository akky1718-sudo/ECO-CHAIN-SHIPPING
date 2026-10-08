Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "   Eco Chain Shipping - Blockchain Management System                 " -ForegroundColor Green
Write-Host "   Starting server on http://localhost:5000 ...                      " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host ""

Start-Process "http://localhost:5000"
node server/index.js
