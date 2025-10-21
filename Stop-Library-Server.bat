@echo off
echo ======================================================
echo  Shutting down Shirzan Library local server...
echo ======================================================

REM Kill any python http.server process quietly
taskkill /F /IM python.exe /T >nul 2>&1

echo 🛑  Server stopped.
echo ------------------------------------------------------
pause
