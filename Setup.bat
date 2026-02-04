@echo off
echo ============================================
echo  RareGh0st Site Setup
echo ============================================
echo.
echo Step 1: Installing dependencies...
echo.
call npm install
echo.
echo Step 2: Generating favicons...
echo (Make sure public\logo.png exists first!)
echo.
if exist "public\logo.png" (
    call Generate-Favicons.bat
) else (
    echo WARNING: public\logo.png not found - skipping favicons
    echo Drop your logo.png into the public\ folder and run Generate-Favicons.bat later
)
echo.
echo ============================================
echo  Setup complete!
echo  Run "npm run dev" to start the dev server
echo  Or push to GitHub and Vercel auto-deploys
echo ============================================
echo.
pause
