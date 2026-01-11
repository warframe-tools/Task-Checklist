# Task Icons

Icons are sourced from the [wiki](https://wiki.warframe.com/) and
[browse.wf](https://browse.wf/). The search function doesn't find everything
though, so digging through [Icons](https://browse.wf/Lotus/Interface/Icons/)
is essential.

Icons should be monochromatic, square, and cropped to fill the entire canvas.
[A script](./resize.sh) is included that handles cropping, squaring, and
resizing (requires [ImageMagick](https://imagemagick.org/)). Most images come
as white and should be inverted so they're possible to see in Windows Explorer
light mode. CSS converts it to all white or all black as appropriate for the
theme. If a monochrome icon is not available, you can add `noIconFilter: true`
to the task and the icon will be shown in color as-is.
