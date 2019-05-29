---
layout: blog-post
title: Call and Apply Methods in JavaScript
type: blog
tag: [JavaScript, call, apply]
description: Simple explanation of call and apply methods.
date: 2013-05-10T00:00:00-00:00
draft: false
---
The `call` and `apply` methods in JavaScript might look complicated at first glance, but they are actually easy to wrap your head around.

Suppose we have an object called `square` with a few properties:

```javascript
var square = {
	color: "red",

	getColor: function () {
		return "I am the color " + this.color + "!";
	},

	getArea: function (width, height) {
		return "My area is " + (width * height) + " feet!";
	}

};
```

It has a `color` property, and two method properties; `getColor` and `getArea`.

The get color method simply return the color property of the object:

```javascript
square.getColor(); // I am the color red!
```

And the second method return the area of the square after we pass in 2 arguments:

```javascript
square.getArea(4, 4); // My area is 16 feet!
```

Simple enough, let's move on and create a second object:

```javascript
var rectangle = {
	color: "blue"
}
```

Note that new `rectangle` object *only* has the `color` property.

Now if we wanted to return the `getColor` or the `getArea` methods we would not be able to because the `rectangle` object does not have such methods. Only the `square` object does.

This is where `call` and `apply` come to play. Let me show you.

### Call Method

```javascript
square.getColor.call(rectangle); // I am the color blue!
```

What just happend? Basically what `call` does is swap out the *context* for `this`.

In our first example where the `square` object called the `getColor` method, the `this` context is *itself* because the method is within it's *scope*.

So if we want use a different object to call a method of a different object we must explicitly tell the method to use a different *context*. We passed in `rectangle` as the first argument of the `call` method to tell the `getColor` function to use the `rectangle` object as it's *context*, instead of `square`.

If we leave out any arguments while calling `call`, we get:

```javascript
square.getColor.call(); // I am the color undefined!
```

It returns `undefined` because the `call` method has no set context so it uses `window` as it's *context*, and `window` does not have the `color` property.

So if we were to add the property to `window` then it all works out:

```javascript
window.color = "green";

square.getColor.call(); // I am the color green!
square.getColor.call(window); // I am the color green!
```

We can also pass in a couple of arguments, for example the `getArea` function requires `width` and `height` to be passed in. To do so just added them *after* the the first argument:.

```javascript
square.getArea.call(rectangle, 6, 4); // My area is 24 feet!
```

Now that we are familiar with the `call` method and know how to pass in arguments, let's discuss it's brother, the `apply` method.

### Apply Method

The `apply` method is almost identitical to the `call` function, the only difference is that we pass in an *array* as the argument instead of individual arguments:

```javascript
var sides = [6, 4];

square.getArea.apply(rectangle, sides); // My area is 24 feet!
```

The apply method is very useful in a situation that involves passing in an *unknown* number of arguments into a function.

For example, getting the maximun value of a list of numbers:

```javascript
var numbers = [22, 4, 354, 54, 546, 85, 12, 98];

Math.max.apply(Math, numbers); // 546
```

Pretty neat huh?

Please comment if you found this helpful or not, and as always you can find all this code as a [gist](https://gist.github.com/miguelmota/5598264).
