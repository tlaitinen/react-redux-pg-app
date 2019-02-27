#!/bin/bash

DATABASE_ADMIN="host=localhost port=15430 sslmode=disable user=postgres password=app dbname=postgres"
DATABASE="host=localhost port=15430 sslmode=disable user=postgres password=app dbname=app"

export RDS_HOST=localhost
export RDS_PORT=15430
export RDS_USERNAME=postgres
export RDS_PASSWORD=app
export RDS_DB_NAME=app
