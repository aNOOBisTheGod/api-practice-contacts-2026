#!/usr/bin/env bash
set -euo pipefail
mkdir -p /tmp/contacts-db
mongod --bind_ip 127.0.0.1 --port 27028 --dbpath /tmp/contacts-db --wiredTigerCacheSizeGB 0.25 --logpath /tmp/mongodb.log --fork
exec node server.cjs
