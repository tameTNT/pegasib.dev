#!/bin/bash
# Run with ./scripts/deploy.sh

set -euo pipefail

git fetch
git status
read -p "Have you git pulled?"
echo
echo "Building servers"
cd heardle_server
deno task build

cd ../home_server
deno task build
cd ..

echo "To update song lists run:"
echo "uv run heardle_server/update_track_info.py -u 05bRCDfqjNVnysz17hocZn -f heardle_loona_track_info.json"
echo "uv run heardle_server/update_track_info.py -u 5qPzAE10vkPbaP5DkN7upp -f heardle_gfriend_track_info.json"

echo "Deploying via pm2"
pm2 reload ecosystem.config.js
pm2 save
pm2 status

echo "Reload nginx config with:"
echo "sudo nginx -s reload"

