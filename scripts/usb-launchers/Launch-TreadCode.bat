@echo off
setlocal
title TreadCode Universal Classroom Edition (Portable)
cd /d "%~dp0"

echo ========================================================================
echo        TREADCODE - UNIVERSAL CLASSROOM EDITION (PORTABLE)
echo ========================================================================
echo  Initializing zero-install local engine from USB...
echo  Privileges: Zero Admin Rights Required (100%% Non-Privileged Mode)
echo ========================================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$appDir = Join-Path (Get-Location) 'app';" ^
  "if (-not (Test-Path $appDir)) { Write-Host 'Error: app/ folder not found. Please do not move launcher outside the TreadCode folder.' -ForegroundColor Red; Read-Host 'Press Enter to exit'; exit 1 };" ^
  "$port = 5183;" ^
  "while ($port -lt 5200) {" ^
  "  try {" ^
  "    $listener = New-Object System.Net.HttpListener;" ^
  "    $listener.Prefixes.Add(\"http://127.0.0.1:$port/\");" ^
  "    $listener.Start();" ^
  "    break;" ^
  "  } catch {" ^
  "    $port++;" ^
  "  }" ^
  "};" ^
  "if (-not $listener.IsListening) { Write-Host 'Failed to bind to local port. Please check your firewall.' -ForegroundColor Red; pause; exit 1 };" ^
  "Write-Host \" Engine Running at: http://127.0.0.1:$port/\" -ForegroundColor Green;" ^
  "Write-Host ' Opening default web browser...' -ForegroundColor Cyan;" ^
  "Start-Process \"http://127.0.0.1:$port/\";" ^
  "Write-Host '';" ^
  "Write-Host '========================================================================' -ForegroundColor Gray;" ^
  "Write-Host ' TreadCode is ready! SmartBoard & Visualizers loaded.' -ForegroundColor White;" ^
  "Write-Host ' To exit, simply CLOSE THIS WINDOW when you are finished teaching.' -ForegroundColor Yellow;" ^
  "Write-Host '========================================================================' -ForegroundColor Gray;" ^
  "$mimeTypes = @{" ^
  "  '.html' = 'text/html; charset=utf-8';" ^
  "  '.htm'  = 'text/html; charset=utf-8';" ^
  "  '.js'   = 'text/javascript; charset=utf-8';" ^
  "  '.mjs'  = 'text/javascript; charset=utf-8';" ^
  "  '.css'  = 'text/css; charset=utf-8';" ^
  "  '.json' = 'application/json';" ^
  "  '.wasm' = 'application/wasm';" ^
  "  '.svg'  = 'image/svg+xml';" ^
  "  '.png'  = 'image/png';" ^
  "  '.jpg'  = 'image/jpeg';" ^
  "  '.jpeg' = 'image/jpeg';" ^
  "  '.gif'  = 'image/gif';" ^
  "  '.webp' = 'image/webp';" ^
  "  '.ico'  = 'image/x-icon';" ^
  "  '.woff' = 'font/woff';" ^
  "  '.woff2'= 'font/woff2';" ^
  "  '.ttf'  = 'font/ttf';" ^
  "  '.mp3'  = 'audio/mpeg';" ^
  "  '.wav'  = 'audio/wav';" ^
  "};" ^
  "try {" ^
  "  while ($listener.IsListening) {" ^
  "    $context = $listener.GetContext();" ^
  "    $request = $context.Request;" ^
  "    $response = $context.Response;" ^
  "    $urlPath = $request.Url.LocalPath.TrimStart('/');" ^
  "    if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = 'index.html' };" ^
  "    $filePath = Join-Path $appDir ($urlPath -replace '/', [System.IO.Path]::DirectorySeparatorChar);" ^
  "    if (-not (Test-Path $filePath -PathType Leaf)) {" ^
  "      $filePath = Join-Path $appDir 'index.html';" ^
  "    };" ^
  "    $ext = [System.IO.Path]::GetExtension($filePath).ToLower();" ^
  "    $mime = $mimeTypes[$ext];" ^
  "    if (-not $mime) { $mime = 'application/octet-stream' };" ^
  "    $response.ContentType = $mime;" ^
  "    $response.AddHeader('Access-Control-Allow-Origin', '*');" ^
  "    $response.AddHeader('Cache-Control', 'no-cache');" ^
  "    try {" ^
  "      $bytes = [System.IO.File]::ReadAllBytes($filePath);" ^
  "      $response.ContentLength64 = $bytes.Length;" ^
  "      $response.OutputStream.Write($bytes, 0, $bytes.Length);" ^
  "    } catch {} finally {" ^
  "      $response.OutputStream.Close();" ^
  "    }" ^
  "  }" ^
  "} finally {" ^
  "  $listener.Stop();" ^
  "  $listener.Close();" ^
  "}"

pause
