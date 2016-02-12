#!/bin/sh
bundler install --binstubs=bin --path=vendor --quiet
./bin/jekyll build -s src -d _site

