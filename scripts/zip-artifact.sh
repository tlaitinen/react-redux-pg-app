#!/bin/bash
rm -rf ./dist
npm run build-backend || exit 1
npm run build-frontend || exit 1
./scripts/copy-files-to-dist.sh
mkdir -p eb
rm -f eb/artifact.zip
zip eb/artifact.zip -r Dockerfile dist/backend dist/frontend package-lock.json package.json package-lock.json database.json migrations .ebextensions || exit 1
