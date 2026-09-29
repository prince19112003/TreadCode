#!/usr/bin/env bash
# ========================================================================
#        TREADCODE - UNIVERSAL CLASSROOM EDITION (PORTABLE LINUX)
# ========================================================================
# Target: Government School Labs (BOSS Linux, KITE GNU-Linux, Ubuntu, Debian)
# Privileges: 0% Root/Sudo Rights Required (Runs directly in user space)
# ========================================================================

cd "$(dirname "$0")" || exit 1

echo "========================================================================"
echo "       TREADCODE - UNIVERSAL CLASSROOM EDITION (PORTABLE LINUX)         "
echo "========================================================================"
echo " Initializing zero-install local engine from USB..."
echo " Supported: BOSS Linux, KITE GNU-Linux, Ubuntu, Debian, Mint"
echo "========================================================================"

if [ ! -d "app" ]; then
  echo "Error: app/ folder not found. Please do not move this launcher outside the TreadCode directory."
  exit 1
fi

PORT=5183
while ss -tuln | grep -q ":$PORT " || netstat -tuln 2>/dev/null | grep -q ":$PORT "; do
  PORT=$((PORT + 1))
done

# Browser open function
open_browser() {
  local url="$1"
  if command -v xdg-open > /dev/null 2>&1; then
    xdg-open "$url" > /dev/null 2>&1 &
  elif command -v sensible-browser > /dev/null 2>&1; then
    sensible-browser "$url" > /dev/null 2>&1 &
  elif command -v x-www-browser > /dev/null 2>&1; then
    x-www-browser "$url" > /dev/null 2>&1 &
  elif command -v google-chrome > /dev/null 2>&1; then
    google-chrome "$url" > /dev/null 2>&1 &
  elif command -v firefox > /dev/null 2>&1; then
    firefox "$url" > /dev/null 2>&1 &
  else
    echo "Please open your browser manually and navigate to: $url"
  fi
}

echo " Engine running on: http://localhost:$PORT/"
echo " Opening default web browser..."

(sleep 1.2 && open_browser "http://localhost:$PORT/") &

echo ""
echo "========================================================================"
echo " TreadCode is active! SmartBoard, Visualizers, and Offline Canvas ready."
echo " To exit, press Ctrl+C or simply close this terminal window."
echo "========================================================================"

# Launch server from app/ directory
cd app || exit 1

if command -v python3 > /dev/null 2>&1; then
  python3 -m http.server "$PORT" --bind 127.0.0.1
elif command -v python > /dev/null 2>&1; then
  python -m SimpleHTTPServer "$PORT"
elif command -v php > /dev/null 2>&1; then
  php -S 127.0.0.1:"$PORT"
elif command -v busybox > /dev/null 2>&1; then
  busybox httpd -f -p 127.0.0.1:"$PORT"
else
  echo "Error: Neither Python, PHP, nor Busybox was found on this system."
  echo "Please consult your lab technician."
  exit 1
fi
