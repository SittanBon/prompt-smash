#!/bin/sh
# Usage: qa/tools/shot.sh <url> <width> <height> <out.png>
# Headless Chrome screenshot at an exact viewport (QA only). Chrome sometimes
# stays alive after writing the file, so wait for the file, then stop it.
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PROFILE="$(mktemp -d)"
rm -f "$4"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --user-data-dir="$PROFILE" --window-size="$2,$3" --virtual-time-budget=2500 \
  --screenshot="$4" "$1" >/dev/null 2>&1 &
PID=$!
i=0
while [ ! -s "$4" ] && [ $i -lt 60 ]; do sleep 0.5; i=$((i+1)); done
sleep 0.5
kill $PID 2>/dev/null; pkill -f "$PROFILE" 2>/dev/null
rm -rf "$PROFILE"
[ -s "$4" ] && echo "saved $4" || echo "FAILED $4"
