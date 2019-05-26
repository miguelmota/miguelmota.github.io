---
layout: blog-post
title: Memoization&#58; Caching function results in JavaScript
type: blog
tags: [JavaScript, memoization, cache]
description: Avoid recalcuation by caching and locally storing function results.
date: 2013-10-30T00:00:00-00:00
draft: false
---
[Memoization](http://en.wikipedia.org/wiki/Memoization) (based on the word memorable) is technique that caches the result of a function in order to avoid recalculation the next time the same function is called. Initially when the function is executed, the result gets added to an object holding the calculated results. When the function is called again, it checks the results object to see if already contains the result and if it does then return it. If it's not cached, then calculate and store it. The code below is a modified version of the memoization example that I came across as I was reading [*Secrets of the JavaScript Ninja*](http://jsninja.com/) by [John Resig](http://ejohn.org/). I also added bit of code to store the result in [local storage](http://www.w3.org/TR/webstorage/) so that we keep a copy of the results even after the page is refreshed.

Finding prime numbers is just a simple example. Where memoization shines is where complex algorithmic function take time to retun a value. It would be time expensive, for example if you were running an HTML5 game where the canvas needs to get redrawn 30 times a second, to execute the same time consuming function over and over again. With memoization the function only runs once (assuming the same parameters were passed in) and the result is cached for future use.

```javascript
// Check for Local Storage Support
function supportLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] != null;
  } catch (e) {
    return false;
  }
}

// Memoization function.
Function.prototype.memoized = function() {
  // Values object for caching results.
  this._values = this._values || {};
  // Stringify function arguments to make key.
  var key = JSON.stringify(Array.prototype.slice.call(arguments));

  // Check if result is cached
  if (this._values[key] !== undefined) {
    console.log('Loaded from cache: %s => %s', key, this._values[key]);
    return this._values[key]

  // Check if result is in local storage.
  } else if (supportLocalStorage && localStorage[this.name+':'+key]) {
    console.log('Loaded from local storage: %s => %s', key, localStorage[this.name+':'+key]);
    return localStorage[this.name+':'+key];

    // Call the original function if result not found and store result.
  } else {
    var value = JSON.stringify(this.apply(this, arguments));
    // Store in local storage.
    if (supportLocalStorage) {
      localStorage[this.name+':'+key] = value;
    }
    console.log('New result: %s => %s', key, value);
    return this._values[key] = value;
  }
};

// Call the memoization function with the original function arguments.
Function.prototype.memoize = function() {
  var fn = this;
  return function() {
    return fn.memoized.apply(fn, arguments);
  };
};

// Check if number is prime function.
var isPrime = (function isPrime(num) {
  var prime = num != 1;
  for (var i = 2; i < num; i++) {
    if (num % i == 0) {
      prime = false;
      break;
    }
  }
  return prime;
}).memoize(); // Make function memoizable.

// Some function that accepts arguments and returns an object.
var someFunc = (function obj(a,b,c) {
  return {foo: (new Date()).getTime()};
}).memoize();
```

<script>
// Memoization technique.
// Try it. Open up the console on your browser and run:
// isPrime(5); // returns a boolean
// or someFunc('foo', 10); // returns an object
// The first time it will do the calculation and store the result,
// so next time you run isPrime(5) it will retrieve the result from
// the function's cache. The result is also stored in local storage
// so that it doesn't have to recalculate if you refresh the page.
// It'll retrieve the stored result from local storage.

// Check for Local Storage Support
function supportLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] != null;
  } catch (e) {
    return false;
  }
}

// Memoization function.
Function.prototype.memoized = function() {
  // Values object for caching results.
  this._values = this._values || {};
  // Stringify function arguments to make key.
  var key = JSON.stringify(Array.prototype.slice.call(arguments));

  // Check if result is cached
  if (this._values[key] !== undefined) {
    console.log('Loaded from cache: %s => %s', key, this._values[key]);
    return this._values[key]

  // Check if result is in local storage.
  } else if (supportLocalStorage && localStorage[this.name+':'+key]) {
    console.log('Loaded from local storage: %s => %s', key, localStorage[this.name+':'+key]);
    return localStorage[this.name+':'+key];

    // Call the original function if result not found and store result.
  } else {
    var value = JSON.stringify(this.apply(this, arguments));
    // Store in local storage.
    if (supportLocalStorage) {
      localStorage[this.name+':'+key] = value;
    }
    console.log('New result: %s => %s', key, value);
    return this._values[key] = value;
  }
};

// Call the memoization function with the original function arguments.
Function.prototype.memoize = function() {
  var fn = this;
  return function() {
    return fn.memoized.apply(fn, arguments);
  };
};

// Check if number is prime function.
var isPrime = (function isPrime(num) {
  var prime = num != 1;
  for (var i = 2; i < num; i++) {
    if (num % i == 0) {
      prime = false;
      break;
    }
  }
  return prime;
}).memoize(); // Make function memoizable.

// Some function that accepts arguments and returns an object.
var someFunc = (function obj(a,b,c) {
  return {foo: (new Date()).getTime()};
}).memoize();
</script>
