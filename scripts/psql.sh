#!/bin/bash

BASE=`dirname $0`
. $BASE/postgres-env.sh

psql "$DATABASE"
