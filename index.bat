@echo off
title 2GO Travel - Servidor Local
echo ===================================================
echo   Iniciando o Servidor de Desenvolvimento da 2GO   
echo ===================================================
echo.

if not exist node_modules (
    echo [INFO] Instalando dependencias (isso pode demorar na primeira vez)...
    call npm install
)

echo [1/2] Iniciando o servidor Next.js em segundo plano...
:: Inicia o npm run dev minimizado
start /min cmd /c "npm run dev"

echo [2/2] Aguardando o servidor iniciar...
:wait_loop
timeout /t 1 >nul
netstat -ano | findstr :3000 >nul
if errorlevel 1 (
    goto wait_loop
)

echo [OK] Servidor ativo! Abrindo o site no navegador...
start http://localhost:3000
exit
