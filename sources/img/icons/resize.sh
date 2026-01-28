#!/bin/sh
mkdir -p resize
magick "$1" \
    -background black -alpha background \
    -bordercolor transparent -border 1 \
    -fuzz '5%' -trim +repage \
    -background transparent -gravity center -extent '1:1#' \
    -resize '256x256>' \
    "resize/$1"
