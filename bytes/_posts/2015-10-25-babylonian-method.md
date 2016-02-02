---
layout: byte
title: How to calculate the square root using Babylonian method.
category: bytes
tags: [JavaScript, algorithm]
description: Babylonian method for calculating square root of a number.
---
[Babylonian method](https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method) for calculating square root of a number.

```javascript
function sqrt(n) {
  if (!(typeof n === 'number' && n >= 0 && !isNaN(n))) {
    return NaN;
  } else if (n === 0) {
    return 0;
  } else if (n === Infinity) {
    return Infinity;
  }

  var val = n;

  while(true) {
    var last = val;
    val = (val + n / val) * 0.5;
    if (Math.abs(val - last) < 1e-9) {
      break;
    }
  }

  return val;
}
```

Usage:

```javascript
console.log(sqrt(25)); // 5
console.log(sqrt(49)); // 7
console.log(sqrt(100000000)); // 10000
console.log(sqrt(5)); // 2.23606797749979
console.log(sqrt(-5)); // NaN
```

On github at [miguelmota/sqrt](https://github.com/miguelmota/sqrt).
