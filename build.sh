#!/bin/sh
bundle install --binstubs=bin --path=vendor --quiet

KIND="$1"
[ "$KIND" = "" ] && KIND="build"

./bin/jekyll $KIND -s src -d _site

# remember this to publish the page
# git subtree push --prefix src origin gh-pages
