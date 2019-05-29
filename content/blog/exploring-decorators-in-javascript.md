---
layout: blog-post
title: Exploring Decorators in JavaScript
type: blog
tag: [JavaScript, decorators, ES7, ES2016]
description: Exploring ES7 Decorators in JavaScript.
date: 2016-03-07T00:00:00-00:00
draft: false
---
In Object Oriented Programming, [The Decorator Pattern](https://en.wikipedia.org/wiki/Decorator_pattern) is a popular design pattern that allows behavior to be added, removed, or modified from an object dynamically at runtime. In the latest iteration of the ES2016/ES7 specification, there is a proposal for [JavaScript Decorators](https://github.com/wycats/javascript-decorators) which lets us annotate and modify classes and properties at design time. I will be going over examples of decorators and how we can start using decorators in our code today.

## Decorator design

A decorator in JavaScript is a function that takes the function `target`, `name`, and `descriptor` as arguments.

The `target` is the target constructor. For example, if placing a decorator on a class constructor; the target will be the class constructor. If placing the decorator on a class method; the target will be the method.

The `name` is simply the name of the method. Decorators on class constructors will not have a name.

The `descriptor` is describes either the data or an accessor. You have used descriptors before if you have ever used [Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). Data and accessor descriptors both share the required keys: `configurable` (can modify) and `enumerable` (ie. show in `for in`). Data descriptor has the additional keys: `value` and `writable` (can assign). Accessor descriptor has the additional keys: `get` (getter) and `set` (setter).

Example of modifying a property by means of the data descriptor:

```javascript
Object.defineProperty(obj, 'key', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: 'static'
});
```

# Examples

Below are some example of decorators in JavaScript.

### Readonly decorator

Here we have a decorator which makes the method `readonly` meaning that we cannot modify it. All we have to do is set the `writable` descriptor property to `false`.

```javascript
function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}
```

Readonly decorator usage:

```javascript
class Robot {
  @readonly
  destroyHumans() {
    return `Destroying humans.`;
  }
}

const robot = new Robot();
console.log(robot.destroyHumans());
// "Destroying humans."

robot.destroyHumans = () => { return false; };
// TypeError: Cannot assign to read only property 'destroyHumans' of [object Object]
```

Now there is *no way* to make the robots not destroy the humans.

### Log decorator

A handy use of decorators is to quickly add logging behavior to a methods. Here we have a `log` decorator that logs the name of the function when invoked. The decorator can also take in a custom log message. Notice how we need to return a function if we want to supply arguments to the decorator.

```javascript
function log(target, name, descriptor) {
  let message = `LOG: Calling \`${name}\` function.`;

  if (typeof target === 'string') {
    message = target;

    return (target, name, descriptor) => {
      console.log(`LOG: ${message}`, name);
      return descriptor;
    };
  } else {
    console.log(message);
    return descriptor;
  }
}
```

Log decorator usage:

```javascript
class Robot {
  @log
  destroyHumans() {
    return `Destroying humans.`;
  }
}

const robot = new Robot();
console.log(robot.destroyHumans());
// LOG: Calling `destroyHumans` function.
// "Destroying humans."
```

Log decorator with custom message:

```javascript
class Robot {
  @log('Invoking the function `%s`')
  destroyHumans() {
    return `Destroying humans.`;
  }
}

const robot = new Robot();
console.log(robot.destroyHumans());
// LOG: Invoking the function `destroyHumans`
// "Destroying humans."
```

We have now logs of when the robots are attacking us.

### Time log decorator

A decator that logs how long a function takes to execute is a good one to have in our utility belt. To achieve this, we sandwich the original function invocation inbetween time start and time end calls, and return the result at the end. Notice how we keep a reference to the original function and override the descriptor `value` property with the wrapped function.

```javascript
function time(target, name, descriptor) {
  const fn = descriptor.value;

  const decoratedFn = function() {
    console.time(name) ;
    const result = fn.apply(target, arguments);
    console.timeEnd(name);
    return result;
  };

  descriptor.value = decoratedFn;

  return descriptor;
}
```

Time log decorator usage:

```javascript
class Robot {
  @time
  destroyHumans() {
    let humans = 7e9;
    while (humans--) {
      this.obliterate();
    }

    return `Humans destroyed.`;
  }

  obliterate() {}
}

const robot = new Robot();
console.log(robot.destroyHumans());
// destroyHumans: 7021ms
// Humans destroyed.
```

As we can see, it will take approximately 7 seconds for the robots to destroy the world's human population.

### Decorate decorator

Decorators can of course be used to wrap a function with another function. Here is a simple *decorate* decorator.

```javascript
function decorate(fn) {
  return (target, name, descriptor) => {
    return {
      configurable: true,
      enumerable: false,
      value: () => {
        return fn(descriptor.value);
      }
    }
  };
}
```

In this example we wrap our method in a [memoize](https://en.wikipedia.org/wiki/Memoization) function which returns the cached value if it exists, otherwise the value is cached:

```javascript
function memoize(fn) {
  const cached = memoize.cache[fn];

  if (cached) {
    console.log('Cache hit!');
    return cached;
  }

  const value = fn();
  memoize.cache[fn] = value;

  console.log('Cache miss.');
  return value;
}

memoize.cache = {};

class Robot {
  @decorate(memoize)
  destroyHumans() {
    return 'Humans destroyed.';
  }
}

const robot = new Robot();
console.log(robot.destroyHumans());
// Cache miss.
// Humans destroyed.
console.log(robot.destroyHumans());
// Cache hit!
// Humans destroyed.
```

Memoization is useful for when you have expensive computations.

### Mixin decorator

With [mixins](https://en.wikipedia.org/wiki/Mixin) we can add or mix in additional behavior to a class. We do this by passing in mixin objects and have the decorator extend the prototype of the class to include them:

```javascript
function mixin(...mixins) {
  return (target, name, descriptor) => {
    mixins.forEach((obj) => {
      for (const key in obj) {
        const desc = Object.getOwnPropertyDescriptor(obj, key);

        Object.defineProperty(target.prototype, key, desc);
      }
    });

    return descriptor;
  };
}
```

Mixin decorator usage:

```javascript
const BrainMixin = {
  think() {
    return 'Today is sunny.';
  }
};

const PhilosophyMixin = {
  ponder() {
    return 'What is the meaning of life?';
  }
};

@mixin(BrainMixin, PhilosophyMixin)
class Robot {
  destroyHumans() {
    return 'Humans destroyed.';
  }
}

const robot = new Robot();
console.log(robot.destroyHumans()); // "Humans destroyed."
console.log(robot.think()); // "Today is sunny."
console.log(robot.ponder()); // "What is the meaning of life?"
```

The robots are now instant philosophers.

## Using decorators today

[Babel](https://babeljs.io/) has become the defacto tool for [transpiling](https://en.wikipedia.org/wiki/Source-to-source_compiler) code of tomorrow into code of today. We can use babel with [gulp](http://gulpjs.com/) to automate the transpilation process.

### Babel Gulpfile

Install required babel and gulp dependencies. At the moment [TC39](http://www.ecma-international.org/memento/TC39.htm) is holding off on implementation of decorators so we need to use the "legacy" transform decorator plugin.

```bash
npm install --save-dev babel babel-register gulp gulp-babel babel-plugin-transform-decorators-legacy
```

`gulpfile.js`:

```javascript
require('babel-register')();
const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('compile', () => {
  return gulp.src('examples/time.js')
    .pipe(babel({
      plugins: [
        'transform-decorators-legacy'
      ]
    }))
    .pipe(gulp.dest('dist'));
});
```

Usage:

```bash
gulp compile
```

### Babel CLI

To quickly try out code can we can use the [Babel CLI](https://babeljs.io/docs/usage/cli/). We need to install babel globally and the babel decorator plugin.

```bash
npm install babel -g
npm install --save-dev babel-plugin-transform-decorators-legacy
```

Usage:

```bash
babel-node --plugins transform-decorators-legacy index.js
```

## Conclusion

Decorators make it easy to compose function and make code much more readable with it's concise syntax. For more examples of decorators, check out the my github repo [ES7-examples](https://github.com/miguelmota/es7-examples).
