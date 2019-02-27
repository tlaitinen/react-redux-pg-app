#!/bin/bash
export DEBUG=true
npm run build-backend || exit 1
./scripts/start-postgres.sh
source ./scripts/postgres-env.sh
./node_modules/db-migrate/bin/db-migrate up
node ./dist/backend/backend/init.js
node ./dist/backend/backend/index.js
./scripts/stop-postgres.sh
