#!/bin/bash

mkdir -p ./dist/backend/backend/db
rsync -r --exclude=index.ts src/backend/db/sql ./dist/backend/backend/db
rsync -r src/backend/locale/ ./dist/backend/backend/locale
