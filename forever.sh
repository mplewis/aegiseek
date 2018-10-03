#!/bin/bash
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

# https://stackoverflow.com/a/697064
until yarn start; do
  echo "Crashed with exit code $?, respawning" >&2
  sleep 1
done
