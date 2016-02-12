#!/bin/sh
bundler install --binstubs=bin --path=vendor --quiet

KIND="$1"
[ "$KIND" = "" ] && KIND="build"

./bin/jekyll $KIND -s src -d _site
