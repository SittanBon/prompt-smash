#!/bin/sh
# Usage: qa/tools/shot-narrow.sh <url> <width> <height> <out.png>
# The iframe is centred, so sips (which crops around the centre) keeps exactly it.
DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/shot.sh" "file://$DIR/frame.html?src=$1&w=$2&h=$3" 800 "$3" "$4" >/dev/null
sips -c "$3" "$2" "$4" >/dev/null && echo "saved $4 ($2x$3)"
