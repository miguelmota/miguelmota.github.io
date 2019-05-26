---
layout: byte
title: How to convert a Buffer to ArrayBuffer
type: bytes
tags: [JavaScript, Node.js]
description: How to convert a Buffer to an ArrayBuffer in JavaScript.
date: 2015-12-29T00:00:00-00:00
draft: false
---
Convert a `Buffer` to `ArrayBuffer`.

```javascript
var isArrayBufferSupported = (new Buffer(0)).buffer instanceof ArrayBuffer;

var bufferToArrayBuffer = isArrayBufferSupported ? bufferToArrayBufferSlice : bufferToArrayBufferCycle;

function bufferToArrayBufferSlice(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function bufferToArrayBufferCycle(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}
```

Usage

```javascript
var b = new Buffer(12);
b.write('abc', 0);

var ab = bufferToArrayBuffer(b);
String.fromCharCode.apply(null, new Uint8Array(ab)); // 'abc'
```

On github at [buffer-to-arraybuffer](https://github.com/miguelmota/buffer-to-arraybuffer)
