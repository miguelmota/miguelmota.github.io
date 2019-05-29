---
layout: byte
title: How to sum the digits of a number
type: bytes
tag: [JavaScript, algorithm, recursion]
description: How to sum the digits of a number.
date: 2015-10-09T00:00:00-00:00
draft: false
---
Algorithm to sum the digits of a number.

```javascript
function digitSum(n) {
  if (!(typeof n === 'number' || n instanceof Number)) {
    return 0;
  }

  if (n <= 0) {
    return 0;
  } else if (n < 10) {
    return n;
  } else if (n === Infinity) {
    return Infinity;
  }

  return (n % 10) + digitSum((n / 10)>>0);
}
```

Usage:

```javascript
console.log(digitSum(1234)); // 10
console.log(digitSum(3890)); 20
console.log(digitSum(Infinity)); // Infinity

console.log(digitSum(-1234)); // 0
console.log(digitSum(-3890)); // 0
console.log(digitSum(-Infinity)); // 0
```

On github at [miguelmota/digit-sum](https://github.com/miguelmota/digit-sum)
