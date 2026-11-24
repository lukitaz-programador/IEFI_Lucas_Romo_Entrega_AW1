@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Instalador de extensiones - Chiavetta Detailing IEFI

set "EDITOR_CMD="
set "FAILED=0"

REM Detectar Cursor o Visual Studio Code.
where cursor >nul 2>&1
if not errorlevel 1 set "EDITOR_CMD=cursor"

if not defined EDITOR_CMD (
    where code >nul 2>&1
    if not errorlevel 1 set "EDITOR_CMD=code"
)

REM Rutas habituales si el comando no esta agregado al PATH.
if not defined EDITOR_CMD if exist "%LOCALAPPDATA%\Programs\Cursor\resources\app\bin\cursor.cmd" set "EDITOR_CMD=%LOCALAPPDATA%\Programs\Cursor\resources\app\bin\cursor.cmd"
if not defined EDITOR_CMD if exist "%LOCALAPPDATA%\Programs\cursor\resources\app\bin\cursor.cmd" set "EDITOR_CMD=%LOCALAPPDATA%\Programs\cursor\resources\app\bin\cursor.cmd"
if not defined EDITOR_CMD if exist "%LOCALAPPDATA%\Programs\Microsoft VS Code\bin\code.cmd" set "EDITOR_CMD=%LOCALAPPDATA%\Programs\Microsoft VS Code\bin\code.cmd"
if not defined EDITOR_CMD if exist "%ProgramFiles%\Microsoft VS Code\bin\code.cmd" set "EDITOR_CMD=%ProgramFiles%\Microsoft VS Code\bin\code.cmd"

if not defined EDITOR_CMD (
    echo No encontre Cursor ni Visual Studio Code en el PATH ni en las rutas habituales.
    echo Abri el editor y habilita su comando CLI:
    echo   Cursor: Ctrl+Shift+P ^> Install 'cursor' command in PATH
    echo   VS Code: Ctrl+Shift+P ^> Shell Command: Install 'code' command in PATH
    echo Luego cerra y volve a abrir esta consola.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo  Instalando extensiones para Chiavetta Detailing IEFI
echo  Editor detectado: %EDITOR_CMD%
echo =====================================================

echo.
echo [1/7] Prettier - formateo de HTML, CSS, JS, JSON y Markdown
call :install esbenp.prettier-vscode

echo.
echo [2/7] EditorConfig - respeta la configuracion del repositorio
call :install EditorConfig.EditorConfig

echo.
echo [3/7] GitLens - historial, ramas y cambios de Git
call :install eamodio.gitlens

echo.
echo [4/7] GitHub Actions - edicion y seguimiento del workflow CI/CD
call :install github.vscode-github-actions

echo.
echo [5/7] GitHub Pull Requests - integracion con repositorios y PRs
call :install GitHub.vscode-pull-request-github

echo.
echo [6/7] YAML - validacion de archivos .yml/.yaml
call :install redhat.vscode-yaml

echo.
echo [7/7] Path Intellisense - autocompletado de rutas de archivos
call :install christian-kohler.path-intellisense

echo.
echo =====================================================
echo  Comprobacion del entorno del proyecto
echo =====================================================
where node >nul 2>&1
if errorlevel 1 (
    echo [FALTA] Node.js. Este proyecto requiere Node.js 22 o superior.
) else (
    node -v
    for /f "tokens=1 delims=v." %%A in ('node -v') do set "NODE_MAJOR=%%A"
    if defined NODE_MAJOR if !NODE_MAJOR! GEQ 22 (
        echo [OK] Version de Node.js compatible.
    ) else (
        echo [ACTUALIZAR] El proyecto requiere Node.js 22 o superior.
    )
)
where npm >nul 2>&1
if errorlevel 1 (
    echo [FALTA] npm. Reinstala Node.js 22 o superior incluyendo npm.
) else (
    npm -v
)

echo.
if "%FAILED%"=="0" (
    echo Instalacion de extensiones finalizada sin errores reportados.
) else (
    echo Algunas extensiones no pudieron instalarse.
    echo En Cursor puede ocurrir si una extension no esta disponible en Open VSX.
    echo Revisa el panel Extensions para instalar una alternativa compatible.
)

echo.
echo Cuando termines, abre la carpeta del repositorio individual en el editor.
echo En la terminal integrada ejecuta:
echo   npm run dev
echo Para ejecutar todas las verificaciones:
echo   npm run verify
echo.
echo No hace falta ejecutar este archivo como administrador.
pause
exit /b 0

:install
 echo Instalando %~1 ...
 call "%EDITOR_CMD%" --install-extension "%~1" --force
 if errorlevel 1 (
     echo [AVISO] No se pudo instalar %~1.
     set "FAILED=1"
 ) else (
     echo [OK] %~1
 )
 exit /b 0
