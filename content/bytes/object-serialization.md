---
layout: byte
title: How to serialize an object in JavaScript
type: bytes
tag: [JavaScript]
description: Serialize an object in Javascript.
date: 2013-12-10T00:00:00-00:00
draft: false
---
Serialize an object in JavaScript.

```javascript
function serialize(obj, prefix) {
  var s = function(obj, prefix) {
    var str = [];
    for(var p in obj) {
      var k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
      if (v !== undefined && v !== null) {
        var set;
        if (v instanceof Object) {
          set = s(v, k);
          str.push(set);
        } else if (Array.isArray(v)) {
          v.forEach(function(n) {
              set = encodeURIComponent(k) + '=' + encodeURIComponent(n);
              str.push(set);
              });
        } else {
          set = encodeURIComponent(k) + '=' + encodeURIComponent(v);
          str.push(set);
        }
      }
    }
    return str.join('&');
  };
  return s(obj, prefix);
}
```

Usage:

```javascript
var obj = {
  foo: 'bar',
  baz: 'quz'
};

console.log(serialize(obj)); // foo=bar&baz=quz
```
