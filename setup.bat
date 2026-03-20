@echo off
echo ================================
echoVoice of the Voiceless - Setup
echo ================================
echo.

echo Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================
    echo Setup complete!
    echo ================================
    echo.
    echo To start the development server, run:
    echo   npm run dev
    echo.
    echo Then open your browser to the URL shown.
    echo.
) else (
    echo.
    echo Installation failed. Please check your Node.js installation.
    echo.
)

pause
