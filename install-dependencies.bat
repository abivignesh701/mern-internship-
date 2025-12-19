@echo off
echo ========================================
echo Installing Backend Dependencies...
echo ========================================
cd backend
call npm install
echo.
echo ========================================
echo Installing Frontend Dependencies...
echo ========================================
cd ..\frontend
call npm install
echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run start-backend.bat in one terminal
echo 3. Run start-frontend.bat in another terminal
echo.
pause
