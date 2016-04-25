---
layout: blog-post
title: Getting Started with RxJS
category: blog
tags: [JavaScript, RxJS, Observables, FRP, Functional Reactive Programming]
description: A guide in to the world of Functional Reactive Programming with RxJS.
---
[RxJS](https://github.com/Reactive-Extensions/RxJS) is a JavaScript implementation of the *Reactive Extensions (Rx)*, a model originally developed at Microsoft. RxJS is library that allows you to compose asynchronous and event-based programs using *Observables*. An Observable is similar to the [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) where there is a *Publisher* and *Subscriber*. The Publisher emits values, and whoever is subscribed to it will receive them. In RX, the publisher is called the Observerable and the subscriber is called the Observer. But an Observable is much more, it also behaves like the [Iterator pattern](https://en.wikipedia.org/wiki/Iterator_pattern) where it provides fine control over how to traverse over the data. The Iterator pattern decouples traversal algorithms from it's container. In the Publisher/Subscriber pattern, the publishes *pushes* values to it's subscriber and the subscriber is forced to take in all the data as it comes it. In the Iterator pattern, you can *pull* the values from the collection of data but there isn't a way to push new data to it, otherwise you'd have to poll and that's very inefficient. The Observable is a combination of the Observer pattern and the Iterator pattern. Streams of events are called Observables and subscribers to those events are called Observers. Values in an Observable stream are separated by time instead of by memory.

Observables are also like [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), but on steriods. Promises can only return a single value, and they can't be cancelled once in flight. An Observable can return multiple values and can also be cancelled when needed.

In JavaScript you're familiar with the event emitter pattern which is practically the same as the Publisher/Subscribe pattern. The downside of the event emitter pattern is that there are usually always side effects and there is no way to return a value from the callback. Event emitters are not treated like first-class citizens which means an event emitter can't be passed as an argument, so a series of events such as clicks can't be passed around. The other downside is that you will miss emitted events if the listeners are registered too late. There is no way to *replay* historical events. We will cover how Observables handle all this as we go through the examples.

## An Observable is like a water hose

You can think of an Observable as a variable that constantly emits values similarily like a waterhose spilling out water, and someone is controlling the facuet knob determing precisely when to emit water. However the person emitting water knows that California is in a drought and doesn't want to get a hefty fine by the city for wasting water so he only emits water when someone has connected the receiving end of he water hose to their water jug. The person connected to the water hose can connect filters and maybe merge a hose outputting Kool-Aid to transform the stream so that it the end he has a jug full of filtered Kool-Aid water so satisfy his thirst.

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

## Getting Started

To run the examples you can use Node.js and the [rx](https://www.npmjs.com/package/rx) module:

```bash
npm install rx
```

For the examples requiring the DOM, use [browserify](https://github.com/substack/node-browserify) to spit out a bundle that you include in your HTML file.

```bash
$ browserify file.js -o bundle.js
```

## Observable from single value

In RxJS you can use [`return`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/return.md), or the alias `just` to return a single value as an Observable. Nothing gets ran until there a subscriber which will contain the value as the parameter.

```javascript
Rx.Observable.just(`Hello World`)
.subscribe(result => console.log(result));
```

Outputs:

```bash
Hello World
```

## from

The [`from`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/from.md) method creates Observables from array, array-like, or iterables such as Map, Set, or String.

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

# fromEvent

Use [`fromEvent`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromevent.md) to create an Observable from an event listener. In this example we log the coordinates of the mouse position.

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

In Rx, methods that transform or query sequences are called *operators*. In the previous example, *filter* is an operator.

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

## fromCallback

Using [`fromCallback`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromcallback.md) is useful when you want to create an Observable from a function that invokes a callback with the value. For example:

```javascript
const hello = (message, callback) => callback(`Hello ${message}`);
const sayHello = Rx.Observable.fromCallback(hello);
const source = sayHello(`World`);

source.subscribe(result => console.log(result));
```

Outputs:

```javascript
Hello World
```

### fromNodeCallback

RxJS also provides a nice way of creating Observables from callbacks where the the first parameter is the error message the result if there is one as the second parameter. We use [`fromNodeCallback`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromnodecallback.md) for this since it's a pattern typically found in Node.js programs.

```javascript
const Rx = require('rx');
const fs = require('fs');

const readdir = Rx.Observable.fromNodeCallback(fs.readdir);
const source = readdir('./');

source.subscribe(result => console.log(result),
                error => console.error(error),
                () => console.log('done'));
```

In *all* subscribe methods the first argument is the result handler, the second argument is the error handler, and the third argument is the complete handler which gets emitted when there are no more events to be be emitted.

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

## Creating Observables

We use [`Observable.create`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/create.md) to create an observable sequence from a subscribe method implementation.

```javascript
const source = Rx.Observable.create(observer => {
  observer.onNext(`Hello`);
  observer.onNext(`World`);
  observer.onCompleted();

  return Rx.Disposable.create(() => console.log('disposed'));
});

const subscription = source.subscribe(
                        x => console.log(x),
                        error => console.error(error),
                        () => console.log('done'));

subscription.dispose();
```

Outputs:

```javascript
Hello
World
done
disposed
```

The Observerable takes a subscribe function as it's argument which defines the data to be emitted.

The Observer have 3 methods:

- `onNext`
- `onError`
- `onCompleted`

`onNext` is the equalivant of calling an update function in the Observer pattern where the data is pushed to it's subscribers. If `onCompleted` or `onError` are called then `onNext` won't have any effect anymore.

The [`Disposable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/disposables/disposable.md) returned is optional but only neccessary if you need to do clean-up work after the Observable is disposed.

## Creating Observers

Here's how to create a basic [`Observer`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observer.md) with the `onNext`, `onError`, and `onCompleted` callbacks:

```javascript
const observer = Rx.Observer.create(
                  x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'))
```

All 3 callbacks are optional. To use the Observer you pass it as the argument to the subscribe method of an Observable.

```
source.subscribe(observer);
```

## AJAX with Observables

Wrapping an Ajax request as an Observable is easier than you think. Take a look at this example:

```javascript
function get(url) {
  return Rx.Observable.create(observer => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = () => {
      if (req.status === 200) {
        observer.onNext(req.response);
        observer.onCompleted();
      } else {
        observer.onError(new Error(req.statusText));
      }
    }

    req.onerror = () => {
      observer.onError(new Error('An error occured'));
    };

    req.send();
  });
}

const source = get('https://example.com/');

source.subscribe(response => console.log(response),
                 error => console.error(error),
                  () => console.log('done'));
```

### DOM.ajax

However, there an even easier way by utilizing the [`rx-dom`](https://www.npmjs.com/package/rx-dom) addon library. Rx DOM provides you with multiple ways to create an Observable for Ajax requests, such as [`DOM.ajax`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/ajax.md), [`DOM.get`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/get.md), [`DOM.post`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/post.md), and [`DOM.getJSON`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/getjson.md).

```javascript
const Rx = require('rx');
require('rx-dom');

const source = Rx.DOM.ajax({
  url: 'https://example.com'
});

source.subscribe(response => console.log(response),
                 error => console.error(error),
                  () => console.log('done'));
```

## Operators

Operators are methods on Observables that transform the sequence.

The methods `map`, `filter`, `reduce` are basic operators that you're already used to. They work as you'd expect in RxJS.

```javascript
Rx.Observable.fromArray([1,2,3,4,5])
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

We'll be going over some commonly used operators in no particular order. There are [100+ operators](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators) in RxJS.

## flatMap

When your sequence consists of asyncronous operations, such as Promises or Observables, you need a way to get the final resolved values in order to do operations on them. In the following example we use [`interval`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/interval.md) to emit a value every 100ms and [`take`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/take.md) the first 10. We return a promise that resolves immediately to simulate an asynchronous operation and then we filter the items. However the example won't work because it's filtering a Promise rather than the value.

```javascript
Rx.Observable.interval(100).take(10)
.map(x => Promise.resolve(x))
.filter(x => x % 2 === 0)
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

This is where [`flatMap`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/selectmany.md) (alias `selectMany`) comes in:

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


# Aggregate operators

[Aggregate operators](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/libraries/main/rx.aggregates.md) process a sequence and return a single value. A few examples of aggregates are [`reduce`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/reduce.md), [`every`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/every.md), [`some`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/some.md), [`min`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/min.md), [`max`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/max.md), [`sum`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sum.md), [`average`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/average.md), [`first`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/first.md), and [`last`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/last.md).

### first

Here's an example of using `first`, which takes predicate and returns the first item that statifies condition.

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

### average

Here's an example of operator for computing the average of the sequence.

```javascript
Rx.Observable.range(0, 9)
.average()
.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));
```

Outputs:

```javascript
4
done
```

## scan

Looking back at the previous example... what if the sequence is never ending, how to we get the average of all the numbers by aggregating infinite Observables?

We use [`scan`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/scan.md), which is like `reduce` but emits each intermediate result.

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

We use [`concatAll`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/concatall.md) to concatenate a sequence of Observables or promises into a single Observable.

In this example [`range`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/range.md), which accepts a start value and a count value, returns an observable for each value so we start out with 3 observables. We then `map` over the sequence and each observable now returns a range of 3 more observables. Essentially it's like having an array of arrays. `concatAll` allows us to flatten the sequences to be able to treat it as a single Observable sequence.

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

To explicity cancel a sequence you call the `dispose` method returned from the subcription.

In this example we have two subscriptions that receive values from the interval every 100ms. After 500ms we cancel the second subscription, and the first subscription still continues.

```javascript
const counter = Rx.Observable.interval(100);
const subscriptionA = counter.subscribe(i => console.log(`A ${i}`));
const subscriptionB = counter.subscribe(i => console.log(`B ${i}`));

setTimeout(() => {
  console.log(`Cancelling subscriptionB`);
  subscriptionB.dispose();
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

Most of the time operators implicity cancel subscrioptions. Such as `range`, `take`, `withLatestFrom` and `flatMapLatest` just to name a few.

### Potential errors

Remember that promises can't be cancelled, so when wrapping APIs it's importating to be aware of that.

For example here we use [`fromPromise`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/frompromise.md) to create an Observable from a promise that resolves after 2 seconds. If the promise is resolved we log a message. As you can see we immediately dispose the Observable but the promise isn't cancelled.

```javascript
const promise = new Promise((resolve, reject) => window.setTimeout(resolve, 2000));

promise.then(() => console.log('Potential side effect'));

const subscription = Rx.Observable.fromPromise(promise)
.subscribe(x => console.log('Observable resolved'));

subscription.dispose();
```

Outputs after 2 seconds:

```javascript
Potential side effect
```

## Error handling

Observable are able to catch thrown exceptions and those errors are passed to the `onError` handler.

In this example we try to parse a JSON string. [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) throws an error if the string is unparsable.

```javascript
const invalidJsonString = '{foo":"bar"}';

Rx.Observable.just(invalidJsonString)
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

Rx.Observable.just(invalidJsonString)
.map(string => JSON.parse(string))
.catch(Rx.Observable.return({
  error: 'There was an error parsing JSON'
}))
.subscribe(result => console.log(result),
           error => console.error(`Error! ${error}`),
           () => console.log('done'))
```

Outputs:

```javascript
{ error: 'There was an error parsing JSON' }
done
```

## retry

The [`retry`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/retry.md) operator resubscribes to a sequence when `onError` is invoked. This can come in handy when the internet goes down and you would like to retry operations.

```javascript
const Rx = require('rx');
require('rx-dom');

Rx.DOM.get('http://example.com')
.retry(5)
.subscribe(xhr => console.log(xhr.response),
          error => console.error(error),
          () => console.log('done'));
```

The operator takes a count of times to retry, otherwise it will retry indefinitely.

The observable pipeline should should only contain pure fucntions, meaning that given the same input always produces the same output. There shouldn't be any external state or side effects so keep in mind that `retry` always retries the whole sequence so just be aware of any potential side effects if you do have any state.

## distinct

Use [`distinct`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/distinct.md) to filter out items that have already been emitted.

```javascript
Rx.Observable.fromArray([1,2,2,3])
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

## startWith

[`starWith`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/startwith.md) sets the first value(s) of the Observable by prepending them to the sequence.

```javascript
Rx.Observable.fromArray([1,2,3])
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

## combineLatest

The operator [`combineLatest`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/combinelatest.md) takes two or more Observables and emits the last result of each observable whenever any of them emits a new value.

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

## sample

The [`sample`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sample.md) operator returns the latest value emitted at each interval. The argument it takes is the interval time at which to sample the sequence.

```javascript
Rx.Observable.interval(100)
.sample(200)
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

## timestamp

Use [`timestamp`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timestamp.md) when you need a timestamp returned for when each Observable is emitted.

```javascript
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

# timeInterval

To records the time interval between consecutive values in an observable sequence use the [`timeInterval`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timeinterval.md) operator.

```javascript
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

## distinctUntilChanged

The [`distinctUntilChanged`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/distinctuntilchanged.md) operator is similar to `distinct` except that it filters out values that have already been emitted that are identical until a different value is emitted.

```javascript
Rx.Observable.fromArray([1,2,2,3,2,4])
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

## takeWhile

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

## Subject

A Subject implements both an Observable and Observer. An Observer subscribes to an Observable. An Observerable produces sequences that Observers receive.

```javascript
const Rx = require('rx');

const subject = new Rx.Subject();

subject.subscribe(x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'))

subject.onNext('a');
subject.onNext('b');
subject.onNext('c');
subject.onCompleted();
```

Output:

```javascript
a
b
c
done
```

At any point you can check if there are any active Observers subscribed to it.

```javascript
subject.hasObservers();
```

After `onCompleted` subscribers are no longer actively subscribed.

Here's another example of using `Subject`. The sequences won't start until there is a subscription on the Subject.

```javascript
const subject = new Rx.Subject();

const source = Rx.Observable.interval(100)
.map(x => `interval message ${x}`)
.take(3)

source.subscribe(subject);

subject.subscribe(x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'));

subject.onNext(`message #1`)
subject.onNext(`message #2`)

setTimeout(() => subject.onCompleted(), 300);
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

## AsyncSubject

[`AsyncSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/asyncsubject.md) emits the last value of a sequence if the sequence completes, the value is then cached.

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
const Rx = require('rx');
require('rx-dom');

const getData = (url) => {
  let subject;

  return Rx.Observable.create(observer => {
    if (!subject) {
      subject = new Rx.AsyncSubject();

      Rx.DOM.get(url)
      .subscribe(subject);

      return subject
      .map(xhr => xhr.response)
      .subscribe(observer);
    }

    return subject
    .map(xhr => `cached ${xhr.response}`)
    .subscribe(observer);
  });
};

const source = getData(`http://example.com`);

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

## BehaviorSubject

[BehaviorSubject](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md) represents a value that changes over time. Observers will receive last emitted value and then all subsequent values. Once `BehaviouSubject` is complete it won't emit any more values. `BehaviourSubject` guarantees that there will always be at least one value emitted.

```javascript
const subject = new Rx.BehaviorSubject('foo');

subject.subscribe(x => console.log(x),
           error => console.error(error),
           () => console.log('done'));

subject.onNext('bar');
subject.onCompleted();
```

Outputs:

```javascript
foo
bar
done
```

## ReplaySubject

[`ReplaySubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/replaysubject.md) re-emits any values that have been previously emitted before an Observer has subscribed to it. `ReplaySubject` takes an buffer size limit as the first argument so that it only stores a maximum of *n* number of previous emitted values. The second argument is the window size based on time, so you can retrieve values emitted up to a maximum of *n* milliseconds ago.

First here's an example using a regular `Subject`:

```javascript
const subject = new Rx.Subject();

subject.onNext(-2);
subject.onNext(-1);
subject.onNext(1);
subject.subscribe(x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'))

subject.onNext(2);
subject.onNext(3);
subject.onCompleted();
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

subject.onNext(-2);
subject.onNext(-1);
subject.onNext(1);

subject.subscribe(x => console.log(x),
                  error => console.error(error),
                  () => console.log('done'))

subject.onNext(2);
subject.onNext(3);
subject.onCompleted();
```

Outputs:

```javascript
-1
1
2
3
done
```

See there how easily we were able to get historical values.

Here's an example of using `ReplaySubject` but with a window size of *200ms*:

```javascript
const subject = new Rx.ReplaySubject(null, 200);

setTimeout(() => subject.onNext(1), 100)
setTimeout(() => subject.onNext(2), 200)
setTimeout(() => subject.onNext(3), 300)

setTimeout(() => {
  subject.subscribe(x => console.log(x),
                    error => console.error(error),
                    () => console.log('done'))

  subject.onNext(4);
  subject.onCompleted();
}, 350);
```

Outputs:

```javascript
2
3
4
done
```

<!--
other stuff to talk about

# Hot and Cold Observables

Hot observables emit values regardless if there are observers subscribed.
Cold observables emit the entire sequence of values from the start to each observer.

Rx.Observable.range is a cold observable because it returns the entire range on each subscribopiton
Rx.interval is a cold observable

cold.js

use share to turn it into a hot observable

manual below

Connectable Observable
We can told a cold observable to hot using publish.
Calling publish creates a new observable that acts as a proxy to the original one.
it does that by subscribing itself to the original and pushing the values it receives to it's subscribers.

hotcold.js

with share we don't have to worry about connecting

we can use bufferWithTime to process everything in a batch. It takes a time parameter for when to release the batch as an array

bufferWithTime.js

pairwise.js

forkJoin


# Schedulers
schedulers allow us to control time and concurrency with more precision and helps with testing code

Schedulers schedule an action to happened in the future.
You can use schedulers to execute code synchronously or asynchronously

scheduler-sync.js
scheduler-async.js

you can switch to use async scheduler on the fly for expensive operations

currentThread is default scheduler.

scheduler-switch.js

observeOn returns an observable that uses the passed scheduler, which will make that call on every onNext call.

subscribeOn makes the subscription and un-subscription work of an Observable to run on that Scheduler.

Immediate Scheduler, it's synchronous, blocks thread

scheduler-immediate.js

Default scheduler, is like setTimeout(0) in browser and process.nextTick in NOde.js> it's async, non blocking.
scheduler-immediate-real.js

current thread scheduler is syncronous like the immediate scheduler but in recursive operations it enqueues the operations to execute.

current-thread-scheudler.js

useful for when using recursive operations such as repeat

Testing with scheudlers

The TestScheduler is designed to help with testing. TestScheduler is a specialization of VirtualTimeScheduler which executes actions in "virutal" time instead of real time.

test-scheduler.js

we specify the "time" at which the value should be emitted.
it runs immediately since the time is "virtual". It just respects the order that we specify.

with a normal scheduler it would take 300ms

pipelines are efficient unlike chaining es5 collection methods. They are are composed and traversed only once.

efficient.js

when we use take, then we only iterate those items, not the whole array. This is called lazy evaluation

json-merge.js

thinking in stream the complexity of the program goes down.

intervalmerge.js

marble diagrams are visual representation of for visualizing sequences.

# Helpers

Rx.helpers.identity

Rx.DOM.ready for when dom is ready
-->

## Conclusion

Once you get into the thought process of always thinking in streams, RxJS does wonders.

Examples in this article were used with *RxJS v4.1.0*, and the code example can be found in this [github repo](https://github.com/miguelmota/rxjs-examples).

## Resources

- [RxJS documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc)
- [Online book for Rx documentation](http://xgrommx.github.io/rx-book/)
