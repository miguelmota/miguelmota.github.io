---
layout: byte
title: How to convert an ArrayBuffer to Buffer
type: bytes
tag: [JavaScript, Node.js]
description: How to convert an ArrayBuffer to Buffer in JavaScript.
date: 2015-12-29T00:00:00-00:00
draft: false
---
Convert an `ArrayBuffer` to `Buffer`.

```javascript
var isArrayBufferSupported = (new Buffer(new Uint8Array([1]).buffer)[0] === 1);

var arrayBufferToBuffer = isArrayBufferSupported ? arrayBufferToBufferAsArgument : arrayBufferToBufferCycle;

function arrayBufferToBufferAsArgument(ab) {
  return new Buffer(ab);
}

function arrayBufferToBufferCycle(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
  }
  return buffer;
}
```

Usage

```javascript
var ab = new ArrayBuffer(12);
var v = new DataView(ab);
[].slice.call('abc').forEach(function(s, i) {
  v[i] = s.charCodeAt(0);
});

var b = arrayBufferToBuffer(ab);

b.toString('utf8', 0, 3); // 'abc'
```

On github at [miguelmota/arraybuffer-to-buffer](https://github.com/miguelmota/arraybuffer-to-buffer).
