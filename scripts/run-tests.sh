#!/bin/bash
tsc || exit 1
npm run build-backend || exit 1
. ./scripts/start-postgres.sh `pwd`/postgresql-test
psql "$DATABASE_ADMIN" < scripts/init.sql
./node_modules/db-migrate/bin/db-migrate up
npm run jest
./scripts/stop-postgres.sh
