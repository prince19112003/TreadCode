#!/bin/bash
# ========================================================================
#        TREADCODE - UNIVERSAL CLASSROOM EDITION (MACOS PORTABLE)
# ========================================================================

cd "$(dirname "$0")" || exit 1

echo "========================================================================"
echo "          TREADCODE - UNIVERSAL CLASSROOM EDITION (MACOS)               "
echo "========================================================================"
echo " Starting zero-install offline server from USB..."
echo "========================================================================"

if [ ! -d "app" ]; then
  echo "Error: app/ folder not found. Please do not move this launcher."
  exit 1
fi

PORT=5183
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; do
  PORT=$((PORT + 1))
done

echo " Local Engine running on: http://localhost:$PORT/"
echo " Opening browser..."

(sleep 1 && open "http://localhost:$PORT/") &

echo ""
echo "========================================================================"
echo " TreadCode is active! SmartBoard & Visualizers loaded."
echo " When done teaching, simply close this Terminal window."
echo "========================================================================"

cd app || exit 1
python3 -m http.server "$PORT" --bind 127.0.0.1
