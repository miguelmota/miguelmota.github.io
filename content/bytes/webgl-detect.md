---
layout: byte
title: How to detect WebGL support
type: bytes
tag: [JavaScript, WebGL]
description: Detect if browser supports WebGL.
date: 2015-05-25T00:00:00-00:00
draft: false
---
Detect if browser supports WebGL.

```javascript
function webglDetect() {
  var canvas = document.createElement('canvas');
  var contextNames = ['webgl','experimental-webgl','moz-webgl','webkit-3d'];
  var context;

  if (navigator.userAgent.indexOf('MSIE') > -1) {
    try {
      context = WebGLHelper.CreateGLContext(canvas, 'canvas');
    } catch(e) {}
  } else {
    for (var i = 0; i < contextNames.length; i++) {
      try {
        context = canvas.getContext(contextNames[i]);
        if (context) {
          break;
        }
      } catch(e) {}
    }
  }

  return !!context;
}
```

Usage:

```javascript
if (webglDetect()) {
    // WebGL is supported
}
```

On github at [miguelmota/webgl-detect](https://github.com/miguelmota/webgl-detect).
