@echo off
echo Szukam procesow na porcie 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Zabijam proces PID: %%a
    taskkill /PID %%a /F
)
echo Gotowe!
