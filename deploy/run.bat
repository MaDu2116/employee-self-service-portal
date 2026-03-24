@echo off
chcp 65001 >nul
echo ==========================================
echo   Employee Self-Service Portal
echo ==========================================
echo.
echo [1/3] Pulling latest images...
docker compose pull
if errorlevel 1 (
    echo.
    echo LOI: Khong the pull images. Kiem tra Docker Desktop da chay chua.
    pause
    exit /b 1
)
echo.
echo [2/3] Starting all services...
docker compose up -d
echo.
echo [3/3] Waiting for services to initialize...
timeout /t 15 /nobreak >nul
echo.
echo ==========================================
echo   Application is running!
echo.
echo   Frontend: http://localhost
echo   Backend:  http://localhost:3001
echo   Health:   http://localhost:3001/health
echo ==========================================
echo.
echo   Tai khoan mac dinh:
echo   HR Admin:  admin@company.com / admin123
echo   Nhan vien: nv1@company.com   / employee123
echo   Nhan vien: nv2@company.com   / employee123
echo.
echo   De dung: chay stop.bat
echo.
pause
