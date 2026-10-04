#!/usr/bin/env bash
# Full speed run, one job at a time: Node 20 and 24, then Chromium and Firefox.
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/build-perf.mjs
for v in 20 24; do
  bin=$(ls -d ~/.nvm/versions/node/v$v.*/bin 2>/dev/null | tail -1)
  [ -n "$bin" ] && "$bin/node" bench/node.mjs "$@"
done
node bench/browser.mjs chromium firefox --rounds 7 --cold 25
node bench/report.mjs
