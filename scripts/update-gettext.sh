#!/bin/bash

node ./scripts/update-gettext.js

./scripts/update-gettext-messages.sh backend
./scripts/update-gettext-messages.sh frontend

