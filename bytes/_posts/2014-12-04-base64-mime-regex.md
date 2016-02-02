---
layout: byte
title: How to extract the MIME type from a base64 string.
category: bytes
tags: [JavaScript, Math]
description: Extract the MIME type from a base64 string using a regular expression.
---
Extract the MIME type from a base64 string using a regular expression.

```javascript
function base64MimeType(encoded) {
  var result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
}
```

Usage:

```javascript
var encoded = 'data:image/png;base64,iVBORw0KGgoAA...5CYII=';

console.log(base64Mime(encoded)); // "image/png"
console.log(base64Mime('garbage')); // null
```

On github at [miguelmota/base64mime](https://github.com/miguelmota/base64mime)
