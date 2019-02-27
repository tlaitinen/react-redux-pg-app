#!/bin/bash

APP=$1
msgmerge --update --no-fuzzy-matching --backup=off src/$APP/locale/fi/LC_MESSAGES/messages.po src/$APP/locale/templates/LC_MESSAGES/messages.pot
msgmerge --update --no-fuzzy-matching --backup=off src/$APP/locale/en/LC_MESSAGES/messages.po src/$APP/locale/templates/LC_MESSAGES/messages.pot

msgattrib --set-obsolete --ignore-file=src/$APP/locale/templates/LC_MESSAGES/messages.pot -o src/$APP/locale/fi/LC_MESSAGES/messages.po src/$APP/locale/fi/LC_MESSAGES/messages.po && msgattrib --no-obsolete -o src/$APP/locale/fi/LC_MESSAGES/messages.po src/$APP/locale/fi/LC_MESSAGES/messages.po
msgattrib --set-obsolete --ignore-file=src/$APP/locale/templates/LC_MESSAGES/messages.pot -o src/$APP/locale/en/LC_MESSAGES/messages.po src/$APP/locale/en/LC_MESSAGES/messages.po && msgattrib --no-obsolete -o src/$APP/locale/en/LC_MESSAGES/messages.po src/$APP/locale/en/LC_MESSAGES/messages.po
