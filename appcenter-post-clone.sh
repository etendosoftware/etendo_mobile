#!/usr/bin/env bash
# Add authentication to our private repo to install npm packages
echo """
registry=https://registry.npmjs.org
""" > .npmrc

exit 0
