#!/bin/bash
. ./scripts/start-postgres.sh
psql "$DATABASE_ADMIN" < scripts/init.sql
./node_modules/db-migrate/bin/db-migrate up
./scripts/stop-postgres.sh
