---
layout: blog-post
title: CSS3 Filters
type: blog
tag: [CSS3, demo]
description: Spice up the way your photos look with CSS3 filters.
date: 2012-07-22T00:00:00-00:00
draft: false
---
Webkit has implemented CSS filters, which can spice up the way your photos look without the hassle of having to deal with software like Photoshop.

Currently there are **10** CSS filters available, which are: `blur`, `brightness`, `contrast`, `drop-shadow`, `grayscale`, `hue-rotate`, `invert`, `opacity`, `saturate` and `sepia`.

In the meantime you must use the `-webkit-` vendor prefix, like so ([gist](https://gist.github.com/miguelmota/5333165)):

```css
img {
  -webkit-filter: blur(2.5px); /* values: 0px - 25px */
  -webkit-filter: brightness(5%); /* values: -100% - 100% */
  -webkit-filter: contrast(1.5); /* values: 0 - 5 */
  -webkit-filter: drop-shadow(3px 3px 10px rgba(0,0,0,.5)) ; /* values: x-offset y-offset blur-radius color */
  -webkit-filter: grayscale(.5); /* values: 0 - 1 */
  -webkit-filter: hue-rotate(5deg); /* values: 0deg - 360deg */
  -webkit-filter: invert(1); /* values: 0 - 1 */
  -webkit-filter: opacity(.8); /* values: 0 - 1 */
  -webkit-filter: saturate(1.5); /* values: 0 - 5 */
  -webkit-filter: sepia(.5); /* values: 0 - 1 */
}
````

You can also combine multiple filters in one line seperated by a space:

```css
-webkit-filter: blur(2.5px) brightness(5%) contrast(1.5);
```

CSS filters can be used in an unimaginable ton of ways. The only downside is that currently only [Google Chrome](http://www.google.com/chrome) version 18 and up supports this feature.

Check out the demo and perhaps leave some feedback in the comments below.

[View the demo »](demo)
