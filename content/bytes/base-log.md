---
layout: byte
title: How to find the logarithm of a number with specified base
type: bytes
tag: [JavaScript]
description: Find the logarithm of a number with specified base.
date: 2015-10-23T00:00:00-00:00
draft: false
---
Find the logarithm of a number (y) with specified base (x). log<sub>x</sub>Y

```javascript
function baseLog(x, y) {
  return Math.log(y) / Math.log(x);
}
```

Usage:

```javascript
console.log(baseLog(5, 25)); // 2
console.log(baseLog(7, 49)); // 2
console.log(baseLog(2, 8)); // 3
console.log(baseLog(4, 64)); // 3
console.log(baseLog(2, 16)); // 4
```
