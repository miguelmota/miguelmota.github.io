---
layout: blog-post
title: Understanding Prototype in JavaScript
type: blog
tags: [javascript, prototype]
description: An attempt at demonstrating what prototype in JavaScript is.
date: 2013-04-25T00:00:00-00:00
draft: false
---
**A `prototype` is an object from where other objects inherit properties from**. All objects in JavaScript are descended from `Object`, a global object. Why this matters I'll explain later, but for now let's jump in to some code.

### Constructor and Methods

Let's define a functional object constructor called `Quadrilateral` and have `width` and `height` as parameters.

```javascript
// Define our constructor
var Quadrilateral = function(width, height) {
	this.width = width;
	this.height = height;

	return this;
}
```

Traditionally if we wanted to have a method we would define it something like this:

```javascript
// Define our constructor
var Quadrilateral = function(width, height) {
	this.width = width;
	this.height = height;

	// Define our method
	this.getWidth = function() {
		return this.width;
	}

	return this;
}
```

We then can create a `new` object of type `Quadrilateral`. For this example it will have a width of `4` and height of `4`:

```javascript
var mysquare = new Quadrilateral(4,4);
```

This is how we then call the `getWidth` method:

```javascript
mysquare.getWidth());
```

Which returns the number `4`.

Now let's do what we just did using `prototype`:

```javascript
// Define our constructor
var Quadrilateral = function(width, height) {
	this.width = width;
	this.height = height;

	return this;
}

// Define our method
Quadrilateral.prototype.getWidth = function() {
	return this.width;
}
```

Once again we can call the `getWidth` method which returns the number `4`

```javascript
mysquare.getWidth());
```

You may be wondering what just happened. Everything should look the same except for the `getWidth` method. We defined this method as a `prototype` function rather than defining it inside the `Quadrilateral` object constructor.

The benefit of doing it this way is that since prototypes are static objects, each instance of the `Quadrilateral` object will reference the `prototype` functions. If we defined the method function inside the constructor, a new anonymous function would be created for it every time the constructor is called. This can **save unnecessary memory from being used**.

With prototype we can easily add new functions to the object. Let's define a method for setting the dimensions on our `Quadrilateral` object:

```javascript
Quadrilateral.prototype.setDimensions = function(width, height) {
	this.width = width;
	this.height = height;

	return this;
}
```

Let's try out our new method:

```javascript
mysquare.setDimensions(7,7);
```

Now if we call `mysquare.getWidth()` we get the number `7`.

### Inheritence

One neat advantage to using prototype is **object inheritance**. For example, let's create a new contructor called `Rectangle` with the same parameters as our `Quadrilateral` constructor.

```javascript
var Rectangle = function(width, height){
	this.width = width;
	this.height = height;

	return this;
};
```

To inherit methods and properties from the `Quadrilateral` object, we simply do:

```javascript
Rectangle.prototype = new Quadrilateral();
```

But wait, although this just inherits all the goodies, our new object does not know what it acually *is*. We Have to tell our Rectangle object that it's a Rectangle. Other wise instances of Rectangle would have a constructor of Quadrilateral. We do that by setting the `constructor` prototype:

```javascript
Rectangle.prototype.constructor = Rectangle;
```

We then can create an instance of type `Rectangle`:

```javascript
var myrectangle = new Rectangle(6,2);
```

Call our *getter* method as usual, and get result of `6`:

```javascript
myrectangle.getWidth());
```

We can test inheritance, and that our `Rectangle` object properties are simply referencing to the `Quadrilateral` object properties by doing:

```javascript
Quadrilateral.prototype.hasOwnProperty('getWidth'); // returns true
Rectangle.prototype.hasOwnProperty('getWidth'); // returns false
```

Test our instances:

```javascript
myrectangle instanceof Quadrilateral; // returns true
myrectangle instanceof Rectangle; //return true

mysquare instanceof Quadrilateral; // returns true
mysquare instanceof Rectangle; //return false
```

### Global Objects

Alright so going back to what I said in the beginning of this post. Every object has a reference to `Object.prototype`. We can confirm this by doing:

```javascript
Quadrilateral instanceof Object; // returns true
Rectangle instanceof Object; //return true
mysquare instanceof Object; // returns true
myrectangle instanceof Object; //return true
```

All objects inherit methods and properties from `Object.prototype`. Ever wondered where methods such as `hasOwnProperty`, `isPrototypeOf`, `toString` or `valueOf` came from? Those come from `Object`.

Basically every function in JavaScript is an instance of root global objects. This means that every function inherits from it. For example, by inheriting from `Function.prototype`, we have access to a number of helpful methods and properties such as `length`, `apply`, `bind`, and `call`. `Array.prototype` gives us mutator methods such as `pop`, `push` and `sort`, as well as accessor methods such as `concat`, `join` and `slice`.

Our ***prototype chain*** looks like this:

`myrectangle` -> `Rectangle.prototype` -> `Quadrilateral.prototype` -> `Object.prototype`

I strongly recommend you check out the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects) documentation on global objects for a better understanding.

We can override a global method, or check if a global method exists and define our own if it does not, for example checking for `Array.prototype.forEach`:

```javascript
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope, this[i], i, this);
    }
  }
}
```

### Conclusion

There is so much more to `prototype` in JavaScript. I will update this post with a part two in the near future once I gain more knowledge on the *awesomesauce* of prototype. All the article code is up as a [gist](https://gist.github.com/miguelmota/5466003). If anything I said does not make sense or if I made mistakes, please correct me by leaving a comment.

All feedback is appreciated.