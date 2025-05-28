@echo off
echo Starting Prize List Manager...
echo.
echo Choose an option:
echo 1. Start Python HTTP Server (Recommended)
echo 2. Open file directly in browser
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Starting Python HTTP Server on port 8000...
    echo Open your browser and go to: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
) else if "%choice%"=="2" (
    echo.
    echo Opening Prize List Manager directly in browser...
    start index.html
) else (
    echo Invalid choice. Please run the script again.
    pause
)
