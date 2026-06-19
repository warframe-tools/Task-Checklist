# Task Icons

Icons are sourced from the [wiki](https://wiki.warframe.com/) and
[browse.wf](https://browse.wf/). The search function doesn't find everything
though, so digging through [Icons](https://browse.wf/Lotus/Interface/Icons/)
is essential.

Icons should be monochromatic, square, and cropped to fill the entire canvas.
A script, [`resize.sh`](./resize.sh)\*, is included that handles cropping,
squaring, and resizing. Most images come as white and should be inverted so
they're possible to see in Windows Explorer light mode
([`invert.sh`](./invert.sh)\* can do this for you). CSS converts it to all white
or all black as appropriate for the theme. If a monochrome icon is not
available, you can add `"noIconFilter": true` to the task and the icon will be
shown in color as-is. For cycle icons, the default is reversed: color icons are
preferred, and you can add `"iconFilter": true` to a cycle's `order` entry for
monochrome icons.

\* `resize.sh` and `invert.sh` both require [ImageMagick](https://imagemagick.org/).

Icons should retain their original filenames as a hint to where they came from.
If any modifications are done to the image (besides inverting/cropping/resizing),
add an underscore at the end of the filename and note the modifications here:

| Icon | Changes | Original |
|------|---------|----------|
| cycles/RetroSeasonal*Icon_.png | Added a gray 'glow' around them so they're easier to see in dark mode. | [Autumn](https://browse.wf/Lotus/Interface/Graphics/Retro/Calendar/RetroSeasonalAutumnIcon.png)<br>[Spring](https://browse.wf/Lotus/Interface/Graphics/Retro/Calendar/RetroSeasonalSpringIcon.png)<br>[Summer](https://browse.wf/Lotus/Interface/Graphics/Retro/Calendar/RetroSeasonalSummerIcon.png)<br>[Winter](https://browse.wf/Lotus/Interface/Graphics/Retro/Calendar/RetroSeasonalWinterIcon.png)<br> |
| tasks/HelpClem_.png | Cut Clem's head out of the Nightwave Act image. | [link](https://browse.wf/Lotus/Interface/Icons/Episodes/Weekly/HelpClem.png) |
| tasks/Kaya_.png | Made the non-transparent parts fully opaque, instead of a transparency gradient. | [link](https://browse.wf/Lotus/Interface/Icons/QuickAccess/1999Mall/Kaya.png) |
| tasks/MiniMapCaviaVendor_.png | Removed drop shadow. | [link](https://browse.wf/Lotus/Interface/Icons/Markers/MiniMapCaviaVendor.png) |
