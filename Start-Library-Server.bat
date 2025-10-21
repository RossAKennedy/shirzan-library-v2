@echo off
cd /d "C:\Users\ApexP\Desktop\Git Library Repo Clone\shirzan-library\library"
echo ======================================================
echo  Starting Shirzan Library local server on port 5500...
echo ======================================================
start "" "http://127.0.0.1:5500/toc.html"
python -m http.server 5500 --bind 127.0.0.1
echo.
echo 🦁  Server is running at: http://127.0.0.1:5500/toc.html
echo (Press CTRL + C here or run Stop-Library-Server.bat to stop)
echo ------------------------------------------------------
pause
