#!/bin/bash

set -euo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 24

echo "Starting Deno build and deployment for home_server..."
cd ~/pegasib.dev/home_server
deno task build

echo "Starting Deno build and deployment for heardle_server..."
cd ../heardle_server
deno task build

cd ~/pegasib.dev
echo "Reloading server process via pm2..."
pm2 reload ecosystem.config.js

echo "⚠️ Don't forget to reload nginx if necessary: sudo nginx -s reload"
