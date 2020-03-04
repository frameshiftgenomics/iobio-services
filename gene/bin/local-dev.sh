#!/bin/bash

set -e

# start webpack in the background to compile the client files and watch for changes
function start_webpack {
  npm run webpack &
}

# start the express server to serve the client
function start_express {
  exec npm run start
}

function run_app {
  start_webpack
  start_express
}

run_app
