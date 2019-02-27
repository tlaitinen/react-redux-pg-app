#!/bin/bash
BASE=`dirname $0`
DATADIR=$1

if [ "x$DATADIR" = "x" ]; then
  DATADIR=`pwd`/postgresql
fi
. $BASE/stop-postgres.sh > /dev/null 2>&1
docker run --name app-postgres -e POSTGRES_PASSWORD=app -p 15430:5432 -d -v $DATADIR:/var/lib/postgresql/data postgres:10.3
RETRIES=20
. $BASE/postgres-env.sh
until psql "$DATABASE_ADMIN" -c "select 1" > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "Waiting for postgres server, $((RETRIES--)) remaining attempts..."
  sleep 1
done
