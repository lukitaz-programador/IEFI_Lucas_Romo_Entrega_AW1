@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Instalador de extensiones - Chiavetta Detailing IEFI

set "EDITOR_CMD="
set "FAILED=0"
set "NODE_MAJOR="

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
echo  Configurando extensiones para Chiavetta Detailing IEFI
echo  Editor detectado: %EDITOR_CMD%
echo =====================================================

echo.
echo [1/5] Prettier - formateo de HTML, CSS, JS, JSON y Markdown
call :install esbenp.prettier-vscode

echo.
echo [2/5] EditorConfig - respeta la configuracion del repositorio
call :install EditorConfig.EditorConfig

echo.
echo [3/5] GitHub Actions - edicion y seguimiento del workflow CI/CD
call :install github.vscode-github-actions

echo.
echo [4/5] YAML - validacion de archivos .yml/.yaml
call :install redhat.vscode-yaml

echo.
echo [5/5] Path Intellisense - autocompletado de rutas de archivos
call :install christian-kohler.path-intellisense

echo.
echo =====================================================
echo  Comprobando requisitos para ejecutar el proyecto
echo =====================================================
where node >nul 2>&1
if errorlevel 1 (
    echo [FALTA] Node.js. Este proyecto requiere Node.js 22 o superior.
    set "FAILED=1"
) else (
    node -v
    for /f "tokens=1 delims=v." %%A in ('node -v') do set "NODE_MAJOR=%%A"
    if defined NODE_MAJOR if !NODE_MAJOR! GEQ 22 (
        echo [OK] Version de Node.js compatible.
    ) else (
        echo [ACTUALIZAR] El proyecto requiere Node.js 22 o superior.
        set "FAILED=1"
    )
)
where npm >nul 2>&1
if errorlevel 1 (
    echo [FALTA] npm. Reinstala Node.js 22 o superior incluyendo npm.
    set "FAILED=1"
) else (
    npm -v
)

echo.
if "%FAILED%"=="0" (
    echo Extensiones instaladas y requisitos disponibles.
) else (
    echo La configuracion no se completo correctamente.
    echo Revisa los mensajes [AVISO], instala las extensiones faltantes desde Extensions
    echo y verifica que Node.js 22 o superior y npm esten en el PATH.
)

echo.
echo Cuando termines, abre la carpeta del repositorio individual en el editor.
echo En la terminal integrada ejecuta:
echo   npm run dev
echo Abre en el navegador la direccion indicada por el servidor.
echo Para ejecutar todas las verificaciones:
echo   npm run verify
echo.
echo HTML, CSS, JavaScript y JSON ya tienen soporte integrado en VS Code y Cursor.
echo Las extensiones no reemplazan Node.js ni el navegador.
echo No hace falta ejecutar este archivo como administrador.
pause
if "%FAILED%"=="0" exit /b 0
exit /b 1

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
