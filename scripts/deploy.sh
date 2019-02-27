#!/bin/bash

./scripts/zip-artifact.sh || exit 1
eb deploy
