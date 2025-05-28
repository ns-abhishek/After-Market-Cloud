@echo off
echo Installing dependencies for ShopEasy Authentication Server...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    echo Make sure to check "Add to PATH" during installation.
    pause
    exit /b 1
)

REM Try to use npm directly
echo Attempting to install dependencies using npm...
call npm install

REM Check if npm install succeeded
if %ERRORLEVEL% NEQ 0 (
    echo npm command failed. Trying alternative approach...
    
    REM Check if package.json exists
    if not exist package.json (
        echo package.json not found in the current directory.
        echo Please make sure you're running this batch file from the server directory.
        pause
        exit /b 1
    )
    
    REM Install dependencies manually using Node.js
    echo Installing dependencies using Node.js directly...
    
    REM Install express
    echo Installing express...
    call node -e "require('child_process').execSync('npm install express cors mongoose bcryptjs jsonwebtoken dotenv nodemailer crypto', {stdio: 'inherit'})"
    
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install dependencies.
        echo Please try installing Node.js again or manually install the dependencies.
        pause
        exit /b 1
    )
)

echo Dependencies installed successfully!
echo You can now run the server using start-server.bat
pause
