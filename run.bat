@echo off
echo ==========================================
echo   Employee Self-Service Portal
echo ==========================================
echo.
echo Building and starting all services...
docker compose up -d --build
echo.
echo Waiting for services to initialize...
timeout /t 15 /nobreak >nul
echo.
echo ==========================================
echo   Application is running!
echo   Frontend: http://localhost
echo   Backend:  http://localhost:3001
echo   Health:   http://localhost:3001/health
echo ==========================================
echo.
echo Default accounts:
echo   HR Admin: admin@company.com / admin123
echo   Employee: nv1@company.com / employee123
echo.
pause
