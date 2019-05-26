---
layout: byte
title: How to find the balance points of an array
type: bytes
tags: [JavaScript, algorithm]
description: Find the balance points of an array.
date: 2015-10-23T00:00:00-00:00
draft: false
---
A balance point is where the left side of the index is equal to the right side of the index. This function returns an array of indices of balance points.

```javascript
function balancePoints(array) {
  if (!Array.isArray(array)) {
    return [];
  }

  var totalSum = array.reduce(sum, 0);
  var leftSum = 0;

  return array.reduce(function(points, current, i) {
    if (i > 0) {
      leftSum += array[i-1];
    }

    var rightSum = totalSum - leftSum - current;

    if (leftSum === rightSum) {
      points.push(i);
    }

    return points;
  }, []);
}
```

Usage:

```javascript
console.log(balancePoints([3, -2, 0, 4, 6, -5])); // [3]
console.log(balancePoints([1, 0, 0, 1])); // [1, 2]
console.log(balancePoints([2, -1, 1, -1, 1])); // [0]
console.log(balancePoints([-4, -7, 6, 2, 9, -3])); // [4]
```

On github at [miguelmota/balance-points](https://github.com/miguelmota/balance-points)
