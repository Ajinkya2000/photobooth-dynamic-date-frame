#!/bin/bash
# Move into the directory where the script is located
cd "$(dirname "$0")"

# Use the full path to node (get by running `which node`)
$(which node) index.js