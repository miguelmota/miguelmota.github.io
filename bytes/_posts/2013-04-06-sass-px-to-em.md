---
layout: byte
title: How to convert pixels to em in Sass
category: bytes
tags: [Sass, css]
description: How to convert pixels to em in Sass
---
Sass function to convert pixels to em.

```sass
$em-base: 16px !default;

@function emCalc($pxWidth) {
  @return $pxWidth / $em-base * 1em;
}
```

Usage:

```
body {
 color: emCalc(20px);
}
```

Compiles to:

```
body {
  color: 1.25em;
}
```
