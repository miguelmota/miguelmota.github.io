---
layout: blog-post
title: Getting Started with RxJS
type: blog
tag: [JavaScript, RxJS, Observables, FRP, Functional Reactive Programming]
summary: A guide in to the world of Functional Reactive Programming with RxJS.
date: 2016-04-22T00:00:00-00:00
draft: false
---
[RxJS](https://github.com/ReactiveX/rxjs) is a JavaScript implementation of the *Reactive Extensions (Rx)*, a model originally developed at Microsoft. RxJS is library that allows you to compose asynchronous and event-based programs using *Observables*. An Observable is similar to the [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) where there is a *Publisher* and *Subscriber*. The Publisher emits values, and whoever is subscribed to it will receive them. In RX, the publisher is called the Observerable and the subscriber is called the Observer. But an Observable is much more, it also behaves like the [Iterator pattern](https://en.wikipedia.org/wiki/Iterator_pattern) where it provides fine control over how to traverse over the data. The Iterator pattern decouples traversal algorithms from it's container. In the Publisher/Subscriber pattern, the publishes *pushes* values to it's subscriber and the subscriber is forced to take in all the data as it comes it. In the Iterator pattern, you can *pull* the values from the collection of data but there isn't a way to push new data to it, otherwise you'd have to poll and that's very inefficient. The Observable is a combination of the Observer pattern and the Iterator pattern. Streams of events are called Observables and subscribers to those events are called Observers. Values in an Observable stream are separated by time instead of by memory.

Observables are also like [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), but on steriods. Promises can only return a single value, and they can't be cancelled once in flight. An Observable can return multiple values and can also be cancelled when needed.

In JavaScript you're familiar with the event emitter pattern which is practically the same as the Publisher/Subscribe pattern. The downside of the event emitter pattern is that there are usually always side effects and there is no way to return a value from the callback. Event emitters are not treated like first-class citizens which means an event emitter can't be passed as an argument, so a series of events such as clicks can't be passed around. The other downside is that you will miss emitted events if the listeners are registered too late. There is no way to *replay* historical events. We will cover how Observables handle all this as we go through the examples.

RxJS is sometimes referred to *"the [lodash](https://lodash.com/) for events"*.

## An Observable is like a water hose

You can think of an Observable as a variable that constantly emits values similarily like a waterhose spilling out water, and someone is controlling the facuet knob determing precisely when to emit water. However the person emitting water knows that California is in a drought and doesn't want to get a hefty fine by the city for wasting water so he only emits water when someone has connected the receiving end of he water hose to their water jug. The person connected to the water hose can connect filters, and maybe even merge a hose outputting Kool-Aid to transform the stream, so that it the end he has a jug full of filtered Kool-Aid water. You can merge, filter, and transform Observable streams the same way.

## Reactive Programming

Reactive programming is a paradigm that uses streams as the core. Mouse events, networks requests, arrays, etc. all these are represented as streams. We *react* when new values are published. Reactive Programming focuses on propagating changes without having to explicitly specify how the propagation happens. It is the *what*, instead of the *how*. By nature, it results in more maintainable code. If you've used a spreadsheet program such as Excel, then you've experienced Reactive Programming. As an example in Excel, you can specify that cell C1 should be the sum of A1 and B1.

```
C1=SUM(A1:B1)
```

or simply put:

```
C = A + B
```

Whenever A or B changes, then C automatically gets updated since it's dependents changed. That is Reactive Programming. You declare *what* should happen, instead of *how* it should happen. RP is declarative, rather than imperative.

Functional Reactive Programming is taking a functional approach to Reactive Programming by using stateless pure functions for operations on the data.

## Getting Started

To run the examples you can use Node.js and the [rxjs](https://www.npmjs.com/package/rxjs) module:

```bash
npm install rxjs
```

At the time of this writing, RxJS was on version 5.0.0 (beta).

For the examples requiring the DOM, use [browserify](https://github.com/substack/node-browserify) to spit out a bundle that you include in your HTML file.

```bash
$ browserify file.js -o bundle.js
```

Ok let's get to it.

## Creating Observables

There are multiple ways of creating Observables dependending on the data structure type.

### of

In RxJS you can use [`of`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-of) to use a single value as an Observable. With Observables, nothing gets ran until there a subscriber listening to the Observable. The Observer on the subscribe method will contain the final result as the parameter.

```javascript
Rx.Observable.of(`Hello World`)
.subscribe(result => console.log(result));
```

Outputs:

```bash
Hello World
```

### from

The [`from`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) method creates an Observable sequence from arrays, array-like objects, or iterables such as Map, Set, or String.

```javascript
const set = new Set([1, 2, 3])
Rx.Observable.from(set)
.map(x => x * 2)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
2
4
6
done
```

### fromEvent

Use [`fromEvent`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromEvent) to create an Observable from an event listener. In this example we log the coordinates of the mouse position.

```javascript
Rx.Observable.fromEvent(document, 'mousemove')
.subscribe(event => console.log(event.clientX, event.clientY));
```

Outputs:

```javascript
95 292
107 292
141 297
173 305
...
```

The great thing about Observables is that you can create new observables based on original ones. For example, if we wanted to log whether the user was on the left side or right side of the screen as he moves the mouse.

```javascript
const mouseMoves = Rx.Observable.fromEvent(document, `mousemove`)

const movesOnRight = mouseMoves.filter(event => event.clientX > window.innerWidth / 2);
const movesOnLeft = mouseMoves.filter(event => event.clientX > window.innerWidth / 2);

movesOnRight.subscribe(event => console.log(`Right side`, event.clientX, event.clientY));
movesOnLeft.subscribe(event => console.log(`Left side`, event.clientX, event.clientY));
```

```text
Left side 196 3
Left side 230 4
Left side 303 4
Right side 1128 25
Right side 1233 65
Right side 1304 97
...
```

In RX, methods that transform or query sequences are called *operators*. In the previous example, *filter* is an operator.

Now imagine if we want to take the coordinates of 10 clicks that occur on the right side of the screen. Think of it as a relational database query where you describe what you want. For example, you'd use a declarative statement in SQL.

```sql
SELECT x,y FROM clicks LIMIT 10
```

Almost just as declaratively as SQL we achieve the same using RxJS:

```javascript
Rx.Observable.fromEvent(document, 'click')
.filter(event => event.clientX > window.innerWidth / 2)
.take(10)
.subscribe(data => console.log(data.clientX, data.clientY))
```

Compared to the traditional imperative, non-declaritive way:

```javascript
let clicks = 0;

document.addEventListener('click', function clickHandler(event) {
  if (clicks < 10) {
    if (event.clientX > window.innerWidth / 2) {
      console.log(event.clientX, event.clientY);
      clicks += 1;
    }
  } else {
    document.removeEventListener('click', clickHandler);
  }
});
```

### bindCallback

Using [`bindCallback`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-bindCallback) is useful when you want to create an Observable from a function that invokes a callback with the value. For example:

```javascript
const hello = (message, callback) => callback(`Hello ${message}`);
const sayHello = Rx.Observable.bindCallback(hello);
const source = sayHello(`World`);

source.subscribe(result => console.log(result));
```

Outputs:

```javascript
Hello World
```

### bindNodeCallback

RxJS also provides a nice way of creating Observables from callbacks where the the first parameter is the error message the result if there is one as the second parameter. We use [`bindNodeCallback`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-bindNodeCallback) for this since it's a pattern typically found in Node.js programs.

```javascript
const Rx = require('rx');
const fs = require('fs');

const readdir = Rx.Observable.bindNodeCallback(fs.readdir);
const source = readdir('./');

source.subscribe(result => console.log(result),
                error => console.error(error),
                () => console.log('done'));
```

In *all* subscribe methods the first argument is the result handler, the second argument is the error handler, and the third argument is the complete handler which gets emitted when there are no more events to be be emitted.

### fromPromise

We use [`fromPromise`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromPromise) to create an Observable from a Promise.

```javascript
const promise = new Promise((resolve, reject) => resolve('Hello World'));

const subscription = Rx.Observable.fromPromise(promise)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
Hello World
done
```

Before we go into depth about the Rx pattern and Observables, let's first take a look at the Observer pattern and Iterator pattern to understand better how these patterns are found in Observables.

## The Observer pattern

In the Observer pattern, AKA Publisher/Subscriber pattern, there is an object called Producer (AKA Subject) that keeps references of all Listeners (AKA Subscribers) subscribed to it. Changes are pushed to Listeners when there is an update from the Producer.

Example of a Producer emitting updates to Subscribers.

```javascript
class Producer {
  constructor() {
    this.listeners = [];
  }

  add(listener) {
    this.listeners.push(listener);
  }

  remove(listener) {
    var index = this.listeners.indexOf(listener);
    this.listeners.splice(index, 1);
  }

  notify(message) {
    this.listeners.forEach(listener => listener(message))
  }
}

const notifier = new Producer();
const listener = (message) => console.log(`Listener received message: ${message}`);

notifier.add(listener);
notifier.notify('Hello');
```

Outputs

```javascript
Listener received message: Hello
```

## The Iterator pattern

An Iterator provides an easy way to traverse it's contents, abstracting away the implementation. The Iterator requires at least the two methods, `next` and `hasNext`, which are used for traversing the collection.

Here is an example of an Iterator:

```javascript
class Iterator {
  constructor(items) {
    this.index = 0;
    this.items = items;
  }

  first() {
    this.reset();
    return this.next();
  }

  next() {
    return this.items[this.index++];
  }

  hasNext() {
    return this.index <= this.items.length;
  }

  reset() {
    this.index = 0;
  }

  each(callback) {
    for (let item = this.first(); this.hasNext(); item = this.next()) {
      callback(item);
    }
  }
}

const items = ['foo', 'bar', 'baz', 'qux'];
const iterator = new Iterator(items);

iterator.each(value => console.log(value));
```

Outputs:

```javascript
foo
bar
baz
qux
```

## Rx pattern and the Observable

An Observable emits it's values in order like an iterator and pushes values to consumers like the Observer pattern. Observable is *pushed* based instead of *pull* based where the consumer has to request the next value. In this context, the consumers of observables are *Observers*. Equivalent of listeners (subscribers) in the Observer pattern. An observable doesn't start streaming values until it has at least one Observer subscribed to it. The Observable can emit a signal when the sequence is completed, like an Iterator. The Observable can also signal when an error occurs, like in the example where we used `fromNodeCallback`.

## Observable.create

We use [`Observable.create`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/create.md) to create an Observable sequence from a subscribe method implementation.

```javascript
const source = Rx.Observable.create(observer => {
  observer.next(`Hello`);
  observer.next(`World`);
  observer.complete();

  return () => console.log(`disposed`);
});

const subscription = source.subscribe(
                        x => console.log(x),
                        error => console.error(error),
                        () => console.log(`done`));

subscription.unsubscribe();
```

Outputs:

```javascript
Hello
World
done
disposed
```

The Observerable takes a subscribe function as it's argument which defines the data to be emitted.

The Observer has 3 methods:

- `next`
- `error`
- `complete`

`next` is the equalivant of calling an update function in the Observer pattern where the data is pushed to it's subscribers. If `complete` or `error` are called then `next` won't have any effect anymore.

The Observable can return an optional function that can handle any clean-up work that you'd have to do after the Observable is unsubscribed.

## Creating Observers

Creating an [`Observer`](http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html) is really simple is all it is an object with `next`, `error`, and `complete` methods:

```javascript
const observer = {
  next: x => console.log(x),
  error: error => console.error(error),
  complete: () => console.log(`done`)
};
```

All 3 methods are optional. To use the Observer you pass it as the argument to the subscribe method of an Observable.

```
source.subscribe(observer);
```

You can also pass in each function as a seperate argument as we've been doing in the examples.

## AJAX with Observables

Wrapping an Ajax request as an Observable is easier than you think. Take a look at this example:

```javascript
function get(url) {
  return Rx.Observable.create(observer => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = () => {
      if (req.status === 200) {
        observer.next(req.response);
        observer.complete();
      } else {
        observer.error(new Error(req.statusText));
      }
    }

    req.onerror = () => {
      observer.error(new Error('An error occured'));
    };

    req.send();
  });
}

const source = get('https://example.com/');

source.subscribe(response => console.log(response),
                 error => console.error(error),
                  () => console.log('done'));
```

### Rx.DOM

However, there an even easier way by utilizing the `Rx.DOM` library. Rx DOM provides you with multiple ways to create an Observable for Ajax requests, such as providing `ajax`, `get`, `post`, and `getJSON` Observables.

```javascript
const Rx = require('rxjs/Rx');
const RxDOM = require('rxjs/Rx.DOM');

const source = RxDOM.Observable.ajax({
  url: window.location.href,
  responseType: 'text/html'
});

source.subscribe(xhr => console.log(xhr),
                 error => console.error(error),
                 () => console.log('done'));
```

The default `responseType` is `json`.

## Operators

Operators are methods on Observables that transform the sequence.

The methods `map`, `filter`, `reduce` are basic operators that you're already used to. They work as you'd expect in RxJS.

```javascript
Rx.Observable.from([1,2,3,4,5])
.map(x => x * 2)
.filter(x => x % 2 === 0)
.reduce((a, b) => a + b)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
30
done
```

We'll be going over some commonly used operators in no particular order. There are [100+ operators](https://github.com/ReactiveX/rxjs/tree/master/src/operator) in RxJS.

## flatMap

When your sequence consists of asyncronous operations, such as Promises or Observables, you need a way to get the final resolved values in order to do operations on them. In the following example we use [`interval`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-interval) to emit a value every 100ms and [`take`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-take) the first 10. We return a promise that resolves immediately to simulate an asynchronous operation and then we filter the items. However the example won't work because it's filtering a Promise rather than the value.

```javascript
Rx.Observable.interval(100).take(10)
.map(x => Promise.resolve(x))
.filter(x => x % 2 === 0)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

This is where [`flatMap`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/selectmany.md) comes in:

```javascript
Rx.Observable.interval(100).take(10)
.flatMap(x => Promise.resolve(x))
.filter(x => x % 2 === 0)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
0
2
4
6
8
done
```

It works now because `flatMap` *subscribes* to each item in the sequence and returns that value. `flatMap` flattens Observables to a single Observable.


## Aggregate operators

[Aggregate operators](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/libraries/main/rx.aggregates.md) process a sequence and return a final result.

### reduce

An aggregate operator you're already familiar with is [`reduce`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-reduce). Here we multiply all the numbers in the sequence:

```javascript
Rx.Observable.from([1,2,3,4,5])
.reduce((acc, x) => acc * x)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

```javascript
120
done
```

### first

Here's an example of using [`first`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-first), which takes an optional predicate and returns the first item that statifies condition.

```javascript
Rx.Observable.range(0, 10)
.filter(x => x % 2 === 0)
.first((x, index, observable) => x > 5)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
6
done
```

Similarly, there's [`last`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-last).

## scan

Imagine if we had a sequence that is never ending and we wanted get the average of all the numbers by aggregating infinite Observables. In this case, we use [`scan`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-scan), which is like `reduce` but emits each intermediate result.

scan.js

```javascript
Rx.Observable.interval(500)
.scan((previous, current) => {
  return {
    sum: previous.sum + current,
    count: previous.count + 1
  }
}, {sum: 0, count: 0})
.map(o => o.sum / o.count)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs a never ending sequence of averages every 500ms:

```javascript
0
0.5
1
1.5
2
2.5
3
3.5
4
4.5
5
5.5
6
6.5
...
```

The scan operator is useful for when ever you want avoid state. For example here we increment a counter only if the current iteration number is even. Notice how we don't need to specify any variables outside of the scope.

```javascript
const updateCount = (acc, i) => i % 2 === 0 ? acc + 1 : acc;
const ticksObservable = Rx.Observable.interval(100)
.scan(updateCount)

ticksObservable.subscribe(eventTicks => console.log(`SubscriberA: ${eventTicks}`))
ticksObservable.subscribe(eventTicks => console.log(`SubscriberB: ${eventTicks}`))
```

```javascript
SubscriberA: 0
SubscriberB: 0
SubscriberA: 0
SubscriberB: 0
SubscriberA: 1
SubscriberB: 1
SubscriberA: 1
SubscriberB: 1
SubscriberA: 2
SubscriberB: 2
SubscriberA: 2
SubscriberB: 2
SubscriberA: 3
SubscriberB: 3
SubscriberA: 3
...
```

## concatAll

We use [`concatAll`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-concatAll) to concatenate a sequence of Observables or promises into a single Observable.

In this example [`range`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-range), which accepts a start value and a count value, returns an observable for each value so we start out with 3 observables. We then `map` over the sequence and each observable now returns a range of 3 more observables. Essentially it's like having an array of arrays. `concatAll` allows us to flatten the sequences to be able to treat it as a single Observable sequence.

```javascript
Rx.Observable.range(0, 3)
.map(x => Rx.Observable.range(x, 3))
.concatAll()
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
0
1
2
1
2
3
2
3
4
done
```

We basically did this:

```javascript
[1,2,3] => [[0,1,2],[1,2,3],[2,3,4]] => [0,1,2,1,2,3,2,3,4]
```

## Cancelling sequences

To explicity cancel a sequence you call the `unsubscribe` method returned from the subcription.

In this example we have two subscriptions that receive values from the interval every 100ms. After 500ms we cancel the second subscription, and the first subscription still continues.

```javascript
const counter = Rx.Observable.interval(100);
const subscriptionA = counter.subscribe(i => console.log(`A ${i}`));
const subscriptionB = counter.subscribe(i => console.log(`B ${i}`));

setTimeout(() => {
  console.log(`Cancelling subscriptionB`);
  subscriptionB.unsubscribe();
}, 500);
```

Outputs:

```javascript
B 0
A 1
B 1
A 2
B 2
A 3
B 3
Cancelling subscriptionB
A 4
A 5
A 6
A 7
A 8
A 9
A 10
A 11
A 12
A 13
...
```

Most of the time operators implicity cancel subscriptions. Such as `range`, `take`, `withLatestFrom` and `flatMapLatest` just to name a few.

### Potential errors

Remember that promises can't be cancelled, so when wrapping APIs it's importating to be aware of that.

For example here we create an Observable from a promise that resolves after 2 seconds. If the promise is resolved we log a message. As you can see we immediately unsubscribe from the Observable but the promise isn't cancelled.

```javascript
const promise = new Promise((resolve, reject) => setTimeout(resolve, 2000));

promise.then(() => console.log('Potential side effect'));

const subscription = Rx.Observable.fromPromise(promise)
.subscribe(x => console.log('Observable resolved'));

subscription.unsubscribe();
```

Outputs after 2 seconds:

```javascript
Potential side effect
```

## Error handling

Observable are able to catch thrown exceptions and those errors are passed to the `error` handler.

In this example we try to parse a JSON string. [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) throws an error if the string is unparsable.

```javascript
const invalidJsonString = '{foo":"bar"}';

Rx.Observable.of(invalidJsonString)
.map(string => JSON.parse(string))
.subscribe(result => console.log(result),
           error => console.error(`Error! ${error}`),
           () => console.log('done'))
```

Outputs:

```javascript
Error! SyntaxError: Unexpected token f
```

If the JSON string is valid, then it outputs:

```javascript
{ foo: 'bar' }
done
```

### catch

You can use the [`catch`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/catch.md) operator to catch errors and continue on with the sequence.

```javascript
const invalidJsonString = '{foo":"bar"}';

Rx.Observable.of(invalidJsonString)
.map(string => JSON.parse(string))
.catch((error) => Rx.Observable.of({
  error: `There was an error parsing JSON`
}))
.subscribe(result => console.log(result),
           error => console.error(`Error! ${error}`),
           () => console.log(`done`))
```

Outputs:

```javascript
{ error: 'There was an error parsing JSON' }
done
```

# More operators

Here are some more operators that are very useful.

### retry

The [`retry`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-retry) operator resubscribes to a sequence when `error` is invoked. This can come in handy when the internet goes down and you would like to retry operations.

```javascript
const Rx = require('rxjs/Rx');
const RxDOM = require('rxjs/Rx.DOM');

RxDOM.Observable.ajax({
  method: 'GET',
  url: 'http://example.com',
  responseType: 'text/html'
})
.retry(5)
.subscribe(xhr => console.log(xhr.response),
           error => console.error(error),
           () => console.log('done'));
```

The operator takes a count of times to retry, otherwise it will retry indefinitely.

The observable pipeline should should only contain pure fucntions, meaning that given the same input always produces the same output. There shouldn't be any external state or side effects so keep in mind that `retry` always retries the whole sequence so just be aware of any potential side effects if you do have any state.

### distinct

Use [`distinct`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-distinct) to filter out items that have already been emitted.

```javascript
const Rx = require('rxjs/Rx.KitchenSink');

Rx.Observable.from([1,2,2,3])
.distinct()
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
1
2
3
done
```

### startWith

[`starWith`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-startWith) sets the first value(s) of the Observable by prepending them to the sequence.

```javascript
Rx.Observable.from([1,2,3])
.startWith('a','b','c')
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
a
b
c
1
2
3
done
```

### combineLatest

The operator [`combineLatest`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-combineLatest) takes two or more Observables and emits the last result of each observable whenever any of them emits a new value.

Here's an example where we combine staggered intervals:

```javascript
const sourceA = Rx.Observable.interval(100)
.map(x => `First: ${x}`)

const sourceB = Rx.Observable.interval(150)
.map(x => `Second: ${x}`)

const sourceC = Rx.Observable.combineLatest(sourceA, sourceB).take(8);

sourceC.subscribe(x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'));
```

Outputs:

```javascript
[ 'First: 0', 'Second: 0' ]
[ 'First: 1', 'Second: 0' ]
[ 'First: 2', 'Second: 0' ]
[ 'First: 2', 'Second: 1' ]
[ 'First: 3', 'Second: 1' ]
[ 'First: 3', 'Second: 2' ]
[ 'First: 4', 'Second: 2' ]
[ 'First: 5', 'Second: 2' ]
done
```

### sampleTime

The [`sampleTime`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-sampleTime) operator returns the latest value emitted at each interval. The argument it takes is the interval time at which to sample the sequence.

```javascript
Rx.Observable.interval(100)
.sampleTime(200)
.take(10)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
0
3
5
7
9
11
12
14
16
18
done
```

### timestamp

Use [`timestamp`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-timestamp) when you need a timestamp returned for when each Observable is emitted.

```javascript
const Rx = require('rxjs/Rx');

Rx.Observable.interval(100)
.timestamp()
.take(10)
.subscribe(x => console.log(`${x.value} ${x.timestamp}`),
           error => console.error(error),
           () => console.log('done'))
```

Outputs:

```javascript
0 1461539653190
1 1461539653322
2 1461539653424
3 1461539653526
4 1461539653628
5 1461539653731
6 1461539653834
7 1461539653935
8 1461539654038
9 1461539654138
done
```

### timeInterval

To records the time interval between consecutive values in an observable sequence use the [`timeInterval`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-timeInterval) operator.

```javascript
const Rx = require('rxjs/Rx.KitchenSink');

Rx.Observable.interval(100)
.timeInterval()
.take(10)
.subscribe(x => console.log(`${x.value} ${x.interval}`),
           error => console.error(error),
           () => console.log('done'))
```

Outputs:

```javascript
0 105
1 136
2 105
3 101
4 105
5 100
6 104
7 101
8 103
9 101
done
```

### distinctUntilChanged

The [`distinctUntilChanged`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-distinctUntilChanged) operator is similar to `distinct` except that it filters out values that have already been emitted that are identical until a different value is emitted.

```javascript
Rx.Observable.from([1,2,2,3,2,4])
.distinctUntilChanged()
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
1
2
3
2
4
done
```

### takeWhile

[`takeWhile`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/takewhile.md) will keep emitting values until the predicate condition returns false.

```javascript
Rx.Observable.range(0, 100)
.takeWhile(x => x < 5)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
0
1
2
3
4
done
```

### bufferTime

Sometimes we need to handle data in batches. This is where [`bufferTime`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-bufferTime) comes in. `bufferTime` takes a buffer time span parameter for when to release the buffer (batch) as an array. Here's an example:

```javascript
Rx.Observable.interval(100)
.bufferTime(300)
.subscribe(result => console.log(result),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
[ 0, 1 ]
[ 2, 3, 4, 5 ]
[ 6, 7, 8 ]
[ 9, 10, 11 ]
[ 12, 13 ]
[ 14, 15, 16 ]
[ 17, 18, 19 ]
[ 20, 21, 22 ]
[ 23, 24, 25 ]
[ 26, 27, 28 ]
[ 29, 30, 31 ]
[ 32, 33, 34 ]
```

## Subjects

Subjects are the equivalent to an EventEmitter, and the only way of multicasting a value to multiple Observers.

### Subject

A Subject implements both an Observable and Observer. An Observer subscribes to an Observable. An Observerable produces sequences that Observers receive.

```javascript
const subject = new Rx.Subject();

subject.subscribe(x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'))

subject.next('a');
subject.next('b');
subject.complete();
```

Output:

```javascript
a
b
c
done
```

After `complete` subscribers are no longer actively subscribed.

Here's another example of using `Subject`. The sequences won't start until there is a subscription on the Subject.

```javascript
const subject = new Rx.Subject();

const source = Rx.Observable.interval(100)
.map(x => `interval message ${x}`)
.take(5);

source.subscribe(subject);

subject.subscribe(x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'));

subject.next(`message #1`)
subject.next(`message #2`)

setTimeout(() => subject.complete(), 300);
```

Outputs:

```javascript
message #1
message #2
interval message 0
interval message 1
interval message 2
done
```

### AsyncSubject

[`AsyncSubject`](http://reactivex.io/rxjs/class/es6/AsyncSubject.js~AsyncSubject.html) emits the last value of a sequence if the sequence completes, the value is then cached.

In this example we have a range that is delayed to demonstrate it's asyncronous. When the sequence finally runs the Observer will always receive the last number in the range sequence.

```javascript
const delayedRange = Rx.Observable.range(0, 5).delay(100);
const subject = new Rx.AsyncSubject();

delayedRange.subscribe(subject);
subject.subscribe(x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'))
```

Outputs:

```javascript
4
done
```

AsyncSubject acts like a promise because it caches the value. If there is an error then the it will cache the error and always return it.

Here's an example of using `AsyncSubject` to cache AJAX requests:

```javascript
const Rx = require('rxjs/Rx');
const RxDOM = require('rxjs/Rx.DOM');

const getData = (url) => {
  let subject;

  return Rx.Observable.create(observer => {
    if (!subject) {
      subject = new Rx.AsyncSubject();

      RxDOM.Observable.ajax({
        url,
        responseType: 'text/html'
      })
      .subscribe(subject);

      return subject
      .map((xhr, b, c) => {
        console.log(xhr, b,c)
          return xhr.response
    })
      .subscribe(observer);
    }

    return subject
    .map(xhr => `cached ${xhr.response}`)
    .subscribe(observer);
  });
};

const source = getData(window.location.href);

source.subscribe(x => console.log(x),
                 error => console.error(error),
                 () => console.log('done'));

setTimeout(() => {
  source.subscribe(x => console.log(x),
                   error => console.error(error),
                   () => console.log('done'))
}, 100);
```

Outputs:

```javascript
<html>...</html>
done
cached <html>...</html>
done
```

### BehaviorSubject

[BehaviorSubject](http://reactivex.io/rxjs/class/es6/BehaviorSubject.js~BehaviorSubject.html) represents a value that changes over time. Observers will receive last emitted value and then all subsequent values. Once `BehaviouSubject` is complete it won't emit any more values. `BehaviourSubject` guarantees that there will always be at least one value emitted.

```javascript
const subject = new Rx.BehaviorSubject('foo');

subject.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));

subject.next('bar');
subject.complete();
```

Outputs:

```javascript
foo
bar
done
```

### ReplaySubject

[`ReplaySubject`](http://reactivex.io/rxjs/class/es6/ReplaySubject.js~ReplaySubject.html) re-emits any values that have been previously emitted before an Observer has subscribed to it. `ReplaySubject` takes an buffer size limit as the first argument so that it only stores a maximum of *n* number of previous emitted values. The second argument is the window size based on time, so you can retrieve values emitted up to a maximum of *n* milliseconds ago.

First here's an example using a regular `Subject`:

```javascript
const subject = new Rx.Subject();

subject.next(-2);
subject.next(-1);
subject.next(1);
subject.subscribe(x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'))

subject.next(2);
subject.next(3);
subject.complete();
```

Outputs:

```javascript
2
3
done
```

Notice how it didn't subscribe to any previously emitted values.

Now here's the same example but using a `ReplaySubject` with a buffer size of *2*:

```javascript
const subject = new Rx.ReplaySubject(2);

subject.next(-2);
subject.next(-1);
subject.next(0);

subject.subscribe(x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'))

subject.next(1);
subject.next(2);
subject.complete();
```

Outputs:

```javascript
-1
0
1
2
done
```

See there how easily we were able to get historical values.

Here's an example of using `ReplaySubject` but with a window size of *200ms*:

```javascript
const subject = new Rx.ReplaySubject(10, 200);

setTimeout(() => subject.next(1), 100)
setTimeout(() => subject.next(2), 200)
setTimeout(() => subject.next(3), 300)

setTimeout(() => {
  subject.subscribe(x => console.log(x),
                    error => console.error(error),
                    () => console.log('done'))

  subject.next(4);
  subject.complete();
}, 350);
```

Outputs:

```javascript
2
3
4
done
```

## Hot and Cold Observables

*Hot Observables* emit values regardless if there are Observers subscribed.

*Cold Observables* emit the entire sequence of values from the start to each Observer when subscribed.

`range` is an example of a cold Observable because it returns the entire range on each subscription. `interval` is also a cold Observable. Take a look at this example and notice how Observer B starts from 0 instead of where the interval currently is at:

```javascript
const source = Rx.Observable.interval(100);
const observerA = source.subscribe(x => console.log(`ObserverA: ${x}`));

setTimeout(() => {
  const observerB = source.subscribe(x => console.log(`ObserverB: ${x}`));
}, 1000);
```

Outputs:

```javascript
ObserverA: 0
ObserverA: 1
ObserverA: 2
ObserverA: 3
ObserverA: 4
ObserverA: 5
ObserverA: 6
ObserverA: 7
ObserverA: 8
ObserverA: 9
ObserverB: 0
ObserverA: 10
ObserverB: 1
ObserverA: 11
ObserverB: 2
ObserverA: 12
ObserverB: 3
ObserverA: 13
ObserverB: 4
ObserverA: 14
ObserverB: 5
...
```

One way to turn a *Cold* Observable to a *Hot* Observable is to call [`publish`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-publish) on the source Observable which returns a [`ConnectableObservable`](http://reactivex.io/rxjs/class/es6/observable/ConnectableObservable.js~ConnectableObservable.html) that once connected will start publishing values and act like a proxy to the original so that any Observer that subscribes to it will receive the continuing values instead of a new sequence. Here's the same example as above but turned into a Hot Observable:

```javascript
const source = Rx.Observable.interval(100);
const publisher = source.publish();

var observerA = publisher.subscribe(x => console.log(`Observer A: ${x}`))

publisher.connect();

setTimeout(() => {
  const observerB = publisher.subscribe(x => console.log(`Observer B: ${x}`));
}, 1000);
```

Outputs:

```javascript
Observer A: 0
Observer A: 1
Observer A: 2
Observer A: 3
Observer A: 4
Observer A: 5
Observer A: 6
Observer A: 7
Observer A: 8
Observer A: 9
Observer B: 9
Observer A: 10
Observer B: 10
Observer A: 11
Observer B: 11
Observer A: 12
Observer B: 12
Observer A: 13
Observer B: 13
Observer A: 14
Observer B: 14
Observer A: 15
Observer B: 15
```

A `ConnectableObservable` acts like a proxy by by subscribing itself to the original and pushing the values it receives to it's subscribers.

### share

RxJS provides the [`share`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-share) method which returns a new Observable that multicasts (shares) the original Observable. It's an easier way to tun a Cold Observable to a Hot Observable because we don't have to manually connect like in the previous example.

```javascript
const source = Rx.Observable.interval(100).share();
const observerA = source.subscribe(x => console.log(`Observer A: ${x}`));

setTimeout(() => {
  const observerB = source.subscribe(x => console.log(`Observer B: ${x}`));
}, 1000);
```

Outputs:

```javascript
Observer A: 0
Observer A: 1
Observer A: 2
Observer A: 3
Observer A: 4
Observer A: 5
Observer A: 6
Observer A: 7
Observer A: 8
Observer A: 9
Observer B: 9
Observer A: 10
Observer B: 10
Observer A: 11
Observer B: 11
Observer A: 12
Observer B: 12
Observer A: 13
Observer B: 13
Observer A: 14
Observer B: 14
Observer A: 15
Observer B: 15
```

## Schedulers

[Schedulers](http://reactivex.io/rxjs/typedef/index.html#static-typedef-Rx.Scheduler) allow us to control time and concurrency with more precision. A Scheduler controls when a subscription starts and when notifications are emitted. Schedulers schedule an action to happened in the future. You can use schedulers to execute code synchronously or asynchronously depending on the context.

### queue

The [queue Scheduler](http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~SchedulerDoc.html) schedules on a a queue in the current event frame to be executed immediately after the current work executes. Use for iterative operations. If the current work running schedules more work to run, then the additional work will be placed on a queue to run after the current work rather than running recursively to avoid stack overflows or infinite recursion.

```javascript
const timeStart = Date.now();
const source = Rx.Observable.range(1, 5)
.do(value => console.log(`processing value ${value}`))
.observeOn(Rx.Scheduler.queue)

console.log('before subscribe');
source.subscribe(x => console.log(`next ${x}`),
                 error => console.error(error),
                 () => console.log(`Total time: ${Date.now() - timeStart}ms`));
console.log(`after subscribe`);
```

Outputs:

```javascript
before subscribe
processing value 1
next 1
processing value 2
next 2
processing value 3
next 3
processing value 4
next 4
processing value 5
next 5
Total time: 16ms
after subscribe
```

### asap

The [asap Scheduler](http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~SchedulerDoc.html) schedules on the micro task queue. It uses [`process.nextTick`](https://nodejs.org/api/process.html#process_process_nexttick_callback_arg) in Node, `setTimeout`, [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), or [`MessageChannel`](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) if using Web Workers.

```javascript
const timeStart = Date.now();
const source = Rx.Observable.range(1, 5)
.do(value => console.log(`processing value ${value}`))
.observeOn(Rx.Scheduler.asap)

console.log('before subscribe');
source.subscribe(x => console.log(`next ${x}`),
                 error => console.error(error),
                 () => console.log(`Total time: ${Date.now() - timeStart}ms`));
console.log(`after subscribe`);
```

Outputs:

```javascript
before subscribe
processing value 1
processing value 2
processing value 3
processing value 4
processing value 5
after subscribe
next 1
next 2
next 3
next 4
next 5
Total time: 17ms
```

### async

The [async Scheduler](http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~SchedulerDoc.html) schedules work with `setInterval`. Typically used for for time-based operations.

```javascript
const timeStart = Date.now();
const source = Rx.Observable.range(1, 5)
.do(value => console.log(`processing value ${value}`))
.observeOn(Rx.Scheduler.async)

console.log('before subscribe');
source.subscribe(x => console.log(`next ${x}`),
                 error => console.error(error),
                 () => console.log(`Total time: ${Date.now() - timeStart}ms`));
console.log(`after subscribe`);
```

Outputs:

```javascript
before subscribe
processing value 1
processing value 2
processing value 3
processing value 4
processing value 5
after subscribe
next 1
next 2
next 3
next 4
next 5
Total time: 17ms
```

By default, if the data returned by operators is small then no Scheduler is used. If the data set is large or infinite then the `queue` Scheduler is used. If the the operator is time-based then the `async` Scheduler is used.

Use [`subscribeOn`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-subscribeOn) to schedule in what context will the subscribe call happen. You can delay or schedule the actual subscription to occur on a a Scheduler. `subscribeOn` makes the subscription and un-subscription work of an Observable to run on that Scheduler.

Use [`observeOn`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-observeOn) to schedule in what context will notifications be delivered. The mediator between the Observable and the Observer will use the Scheduler to schedules notifications. `observeOn` returns an observable that uses the passed scheduler, which will make that call on every `next` call.

You can switch to use an async scheduler on the fly for expensive operations by using `observeOn`. For example:

```javascript
let array = [];
for (var i = 0; i < 1e5; i++) {
  array.push(i);
}

const expensiveOperation = (x) => {
    let k = 1e7;
    while(k--);
    return x;
};

const source = Rx.Observable.from(array)
.groupBy(value => value % 2 === 0)
.map(value => value.observeOn(Rx.Scheduler.asap))
.map(groupedObservable => expensiveOperation(groupedObservable))

console.log(`before subscribe`);
source.subscribe(
  obs => obs.count().subscribe(x => console.log(x)),
  error => console.error(error),
  () => console.log(`done`)
);
console.log(`after subscribe`);
```

Outputs:

```javascript
before subscribe
done
after subscribe
50000
50000
```

Without the scheduler you'd get a synchronous output such as:

```javascript
before subscribe
50000
50000
done
after subscribe
```

<!--
## Testing with scheudlers

The [`TestScheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/testing/testscheduler.md) is designed to help with testing. `TestScheduler` is a specialization of [`VirtualTimeScheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/virtualtimescheduler.md) which executes actions in "virutal" time instead of real time. I'll show you what I mean:

```javascript
```

Outputs:

```javascript
```
We specify the "time" at which the value should be emitted. It runs immediately since the time is "virtual". It just respects the order that we specify.

With a normal scheduler it would take 300ms.
-->

## Recap

The essential concepts of RxJS are:

- **Observable**: represents the an invokable sequence of future values or events.
- **Observer**: is a set of callbacks that knows how to listen to values emitted by the Observable.
- **Subscription**: represents the execution of an Observable, and is also used for cancelling the execution.
- **Operators**: are pure functions that enable a functional programming style of dealing with sequences.
- **Subject**: is the equivalent to an `EventEmitter`, and the way of multicasting a value or event to multiple Observers.
- **Schedulers**: are dispatchers to control concurrency, allowing for coordination when computation happens.

## Conclusion

Once you get into the thought process of always thinking in streams, RxJS does wonders.

Examples in this article were tested with RxJS *v5.0.0*, and the code examples can be found in this [github repo](https://github.com/miguelmota/rxjs-examples).

## Resources and Credits

- [RxJS 5 documentation](http://reactivex.io/rxjs/)
- [RxJS 4 documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc)
- [Online book for RxJS 4 documentation](http://xgrommx.github.io/rx-book/)
- [Reactive Programming with RxJS 4](http://sergimansilla.com/)
