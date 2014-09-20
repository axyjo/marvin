#!/bin/bash
# Adapted from UWFlow

# Bail on errors
set -e

function clean_up() {
  set +e
  kill 0
  exit
}

# Kill all child processes on script abort
trap clean_up SIGTERM SIGINT ERR

echo "Starting mongodb"
mongod --dbpath mongoData &

# Need to sleep so that Mongo has time to start up
sleep 1

echo "Starting flask server"
PYTHONPATH=pylibs python server.py

# Only exit on terminate or interrupt signal
while true; do
  sleep 1
done
