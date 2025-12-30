#!/bin/bash
# Move into the directory where the script is located
cd "$(dirname "$0")"

# Load environment variables from .env in the current (dist) folder
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo "Loaded .env variables"
else
    echo ".env file not found in $(pwd)"
fi

# Explicitly set the path to node (Update this if your 'which node' was different)
NODE_PATH="/home/admin/.nvm/versions/node/v24.11.0/bin/node"

echo "Starting Photobooth Script at $(date)"
$NODE_PATH index.js