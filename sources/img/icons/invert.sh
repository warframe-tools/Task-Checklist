#!/bin/sh
magick mogrify -channel RGB -negate "$1"
