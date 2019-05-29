---
layout: byte
title: How to create an array excluding provided values
type: bytes
tag: [JavaScript]
description: Create an array with excluding provided value.
date: 2015-08-14T00:00:00-00:00
draft: false
---
Create an array excluding provided value.

```javascript
/**
 * arrayWithout
 * @param {array} array - original array
 * @param {array} without - collection to omit
 * @example
 * arrayWithout(['a','b','c'], ['a','b','c']); // ['a']
 */
function arrayWithout(a, w) {
  /*
   * Allows extension of prototype.
   * @example
   * Array.prototype.without = arrayWithout;
   * ['a','b','c'].without(['a','b','c']); // ['a']
   */
  if (Array.isArray(this)) {
    return arrayWithout.apply(null, [this].concat([].slice.call(arguments)));
  }

  a = Array.isArray(a) ? a.slice(0) : [];
  w = flatten([].slice.call(arguments, 1));
  for (var i = 0; i < w.length; i++) {
    var j = a.indexOf(w[i]);
    if (j > -1) {
      a.splice(j,1);
    }
  }
  return a;
}

function flatten(a) {
  return Array.isArray(a) ? [].concat.apply([], a.map(flatten)) : [a];
}
```

Usage:

```javascript
console.log(without(['a','b','c'], 'c')); // ['a','b']
console.log(without(['a','b','c'], ['b','c'])); // ['a']
console.log(without(['a','b','c'], 'b','c')); // ['a']
```

On github at [miguelmota/array-without](https://github.com/miguelmota/array-without).
