---
layout: blog-post
title: Pixelate images with Canvas
category: blog
tags: [JavaScript, canvas, demo]
description: Learn how to pixelate an image with canvas.
---
There may be cases in which you want to pixelate an image, such as creating 8-bit style pixel art themed games or you simply want to give a hint of what an image is about without exposing too much. Turns out that it's not complicated at all to do pixelation with canvas.

[![]({{ page.url }}/pixelation-comparison-screenshot.png)]({{ page.url }}/demo)

[View demo »]({{ page.url }}/demo)

The main methods needed from the [`canvas context`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) are [`imageSmoothingEnabled`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.imageSmoothingEnabled) for rendering crisp pixels and [`drawImage`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage) for drawing those pixels on to the canvas context.

Essentially how it works is we scale down the image and stretch it to a larger size.

Here is the [gist](https://gist.github.com/miguelmota/c64d8ef769df7faf5fc9):

```javascript
// Create new image element.
var image = new Image();

// Set an image.
image.src = 'photo.png';

// Append image to body.
document.body.appendChild(image);

// After image has been loaded in memory invoke a callback.
image.onload = imageLoaded;

// Image loaded callback.
function imageLoaded() {

  // Get the dimensions of loaded image.
  var width = image.clientWidth;
  var height = image.clientHeight;

  // Create canvas element.
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // This is what gives us that blocky pixel styling, rather than a blend between pixels.
  canvas.style.cssText = 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
                         'image-rendering: -moz-crisp-edges;' + // FireFox
                         'image-rendering: -o-crisp-edges;' +  // Opera
                         'image-rendering: -webkit-crisp-edges;' + // Chrome
                         'image-rendering: crisp-edges;' + // Chrome
                         'image-rendering: -webkit-optimize-contrast;' + // Safari
                         'image-rendering: pixelated; ' + // Future browsers
                         '-ms-interpolation-mode: nearest-neighbor;'; // IE

  // Grab the drawing context object. It's what lets us draw on the canvas.
  var context = canvas.getContext('2d');

  // Use nearest-neighbor scaling when images are resized instead of the resizing algorithm to create blur.
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  // We'll be pixelating the image by 80% (20% of original size).
  var percent = 0.2;

  // Calculate the scaled dimensions.
  var scaledWidth = width * percent;
  var scaledHeight = height * percent;

  // Render image smaller.
  context.drawImage(image, 0, 0, scaledWidth, scaledHeight);

  // Stretch the smaller image onto larger context.
  context.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height);

  // Here are what the above parameters mean:
  // canvasElement, canvasXOffsetForImage, canvasYOffsetForImage, imageWidth, imageHeight, imageXOffset, imageYOffset, destinationImageWidth, destinationImageHeight

  // Append canvas to body.
  document.body.appendChild(canvas);
}
```

[View demo »]({{ page.url }}/demo)

For your convenience I abstracted it into a tiny library, [pixelate.js](https://github.com/miguelmota/pixelate), which lets you replace image `src` attributes with a generated [`dataURL`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement.toDataURL) of the pixelated image.
