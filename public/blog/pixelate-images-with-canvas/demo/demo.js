'use strict';

// Creating new image element.
var image = new Image();

// Image to load.
image.src = 'street.png';

// Append image to body.
document.body.appendChild(image);

// After image has been loaded in memory call this function.
image.onload = imageLoaded;

// Image loaded callback.
function imageLoaded() {

  // Get the dimensions of loaded image.
  var width = image.clientWidth;
  var height = image.clientHeight;

  // Creating canvas element.
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

  // We'll be pixelating the image by 80% (20% size of original size).
  var percent = 0.2;

  var scaledWidth = width * percent;
  var scaledHeight = height * percent;

  // Render image smaller
  context.drawImage(image, 0, 0, scaledWidth, scaledHeight);

  // Stretch the smaller image onto context
  context.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height);

  // Append canvas to body.
  document.body.appendChild(canvas);
}
