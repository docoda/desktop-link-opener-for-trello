#!/bin/sh
# Builds the extension package for addons.mozilla.org.
set -e
cd "$(dirname "$0")"
rm -f desktop-link-opener-for-trello.xpi
zip -r -X desktop-link-opener-for-trello.xpi \
  manifest.json background.js redirect.html redirect.js icon.svg _locales \
  -x '*.DS_Store'
echo "Built desktop-link-opener-for-trello.xpi"
