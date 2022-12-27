#!/usr/bin/env bash

# Add authentication to our private repo to install npm packages
echo """
registry=https://repo.futit.cloud/repository/npm-group/
always-auth=true
_auth=${NPM_TOKEN}
""" > .npmrc

exit 0
