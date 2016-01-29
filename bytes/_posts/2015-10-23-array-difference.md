---
layout: byte
title: How to find the difference between arrays
category: bytes
tags: [JavaScript, algorithm]
description: Algorithm to find the difference between array.
---
Returns an array of unique values that is the symmetric difference of the provided arrays.

```javascript
function arrayDifference(/* arrays */) {
  var arrays = [].slice.call(arguments);
  var complement = [];

  for (var i = 0; i < arrays.length; i++) {
    var array = arrays[i];

    if (Array.isArray(array)) {
      for (var j = 0; j < array.length; j++) {
        var value = array[j];
        var atIndex = complement.indexOf(value);

        if (atIndex === -1) {
          complement.push(value);
        } else {
          complement.splice(atIndex, 1);
        }
      }
    }
  }

  return complement;
}
```

Usage

```javascript
console.log(arrayDifference(['foo','bar'], ['bar'])); // ['foo']
console.log(arrayDifference(['foo','bar','qux'],['qux','baz'],['thud','norf','bar'])); // ['foo','baz','thud','norf']
```

On github at [miguelmota/array-complement](https://github.com/miguelmota/array-complement).
