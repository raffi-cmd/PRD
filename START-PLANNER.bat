@echo off
title Visual AI Project Planner
echo ====================================================
echo   Launching Visual AI Project Planner...
echo ====================================================
echo.

if not exist node_modules (
  echo [1/2] First time setup: Installing dependencies...
  call npm install
) else (
  echo [1/2] Dependencies verified.
)

echo.
echo [2/2] Starting local development server...
echo.
call npm run dev

pause
