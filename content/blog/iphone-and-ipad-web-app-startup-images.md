---
layout: blog-post
title: iPhone and iPad Web App Startup Images
type: blog
tag: [HTML, meta, iPhone, iPad, web apps]
description: How to implement iPhone and iPad web app startup images.
date: 2013-04-07T00:00:00-00:00
draft: false
---
In order to avoid having a blank white screen when launching a web app, you can use a `apple-touch-startup-image`. This is displayed momentarily while the web app is loading.

There are a number of `link` tags to target all iPhone and iPad devices which you must use. But there's also a *very important* thing to not do, and that is to **not use** `width=device-width` on the `viewport` meta tag because this will letterbox the viewport and it will not work.

Here is the [gist](https://gist.github.com/miguelmota/5333125) (**Update** 28 Apr 2013: Added apple-touch-icons):

```html
<!--iPhone and iPad Apple Touch Icons -->

<!-- iPhone Non-Retina -->
<link rel="apple-touch-icon-precomposed" sizes="57x57" href="apple-touch-icon-57x57.png">
<!-- iPhone Retina -->
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="apple-touch-icon-114x114.png">

<!-- iPad Non-Retina -->
<link rel="apple-touch-icon-precomposed" href="apple-touch-icon-72x72.png" sizes="72x72">
<!-- iPad Retina -->
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="apple-touch-icon-144x144.png">
```

```html
<!--iPhone and iPad Web App Startup Images -->

<!-- Do NOT use width=device width because it will letterbox viewport. -->
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<!-- iPhone 3 and 4 Non-Retina -->
<link rel="apple-touch-startup-image" media="(device-width: 320px)" href="apple-touch-startup-image-320x460.png">
<!-- iPhone 4 Retina -->
<link rel="apple-touch-startup-image" media="(device-width: 320px) and (-webkit-device-pixel-ratio: 2)" href="apple-touch-startup-image-640x920.png">
<!-- iPhone 5 Retina -->
<link rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" href="apple-touch-startup-image-640x1096.png">

<!-- iPad Non-Retina Portrait -->
<link rel="apple-touch-startup-image" media="(device-width: 768px) and (orientation: portrait)" href="apple-touch-startup-image-768x1004.png">
<!-- iPad Non-Retina Landscape -->
<link rel="apple-touch-startup-image" media="(device-width: 768px) and (orientation: landscape)" href="apple-touch-startup-image-748x1024.png">
<!-- iPad Retina Portrait -->
<link rel="apple-touch-startup-image" media="(device-width: 1536px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)" href="apple-touch-startup-image-1536x2008.png">
<!-- iPad Retina Landscape -->
<link rel="apple-touch-startup-image" media="(device-width: 1536px)  and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)" href="apple-touch-startup-image-2048x1496.png">
```