@echo off
echo Starting ShopEasy Authentication Server...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    echo Make sure to check "Add to PATH" during installation.
    pause
    exit /b 1
)

REM Check if server.js exists
if not exist server.js (
    echo server.js not found in the current directory.
    echo Please make sure you're running this batch file from the server directory.
    pause
    exit /b 1
)

REM Run the server
echo Starting server with Node.js...
node server.js

pause
