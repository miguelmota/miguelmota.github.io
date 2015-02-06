---
layout: blog-post
title: ES6 Examples
category: blog
tags: [ES6, JavaScript]
description: Examples of JavaScript ES6 Features.
---

If you've been up-to-date with what's going on in the JavaScript world then you know that [ES6](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts) is currently the new hotness in town. Below I'm going to be showing examples of some of the nicest features in ES6.

# Modules

Export example (`math.js`):

```javascript
let notExported = 'abc';
export function square(x) {
    return x * x;
}
export const MY_CONSTANT = 123;
```

Import example (`demo.js`):

```javascript
import {square} from 'math';
console.log(square(3));

// alternatively
import 'math' as math;
console.log(math.square(3));
```

# Classes

`Object.assign` example:

```javascript
class Person {
    speak() {
        return 'Howdy';
    }
}

class Job {
    work() {
        return 'Working';
    }
}

Object.assign(Person, Job);

var dexter = Object.create(Person);

dexter.speak(); // 'Howdy'
dexter.work(); // 'Working'
```

Literal example:

```javascript
var person = {
    type: 'human',
    speak() {
        return 'Howdy';
    }
};

var dexter = Object.create(person);

dexter.speak(); // 'Howdy'
```

`Object.setPrototypeOf` example:

```javascript
class Person {
    speak() {
        return 'Howdy';
    }
}

class Job {
    work() {
        return 'Working';
    }
}

var dexter = Object.create(Person);
var job = Object.create(Job);

Object.setPrototypeOf(dexter, job);

dexter.speak(); // 'Howdy'
dexter.work(); // 'Working'
```

Setter and Getter example:

```javascript
class Speaker(name) {
    this.name = name;
    this.years = 0;

    speak(message) {
        return `${this.name}: ${message}`;
    }

    get age() {
        return this.years();
    }

    set age(years) {
        if (Number.isFinite(years)) {
            this.years = years;
        }
    }
}
```

Static methods example:

```javascript
class Point {
    static zero() {
        return new Point(0,0);
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let p = Point.zero();
```

Extends example:

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

console.log((new Point(1,2)).toString()); // (1,2)

class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y); // same as super.constructor(x, y)
        this.color = color;
    }
    toString() {
        return this.color + ' ' + super();
    }
```

# Arrow Functions

Filter example:

```
[1,2,3].filter(value => value % 2); // [1, 3]
```

Identity example:

```javascript
let identity = (() => ({'toString': () => { return 'Kit' } }));

console.log(`${identity()}`); // 'Kit'
```

Sum squares example:

```javascript
let sumSquares = [for (x of [1,2,3]) x*x].reduce((a, b) => a + b);

console.log(sumSquares); // 14
```

Generator example:

```javascript
let idGenerator = (id=0)=>
    (resetId = () => 0,
     nextId = ()=> id++,
     {resetId, nextId});

var nextFrom1000 = idGenerator(1000);

console.log(nextFrom1000.nextId()); // 1000
```

`this` example:

```javascript
function component() {
    let button = document.getElementById('button');
    this.handleClick = function() {

    };
    button.addEventListener('click', () => {
        // no more that = this
        this.handleClick();
    });
}
```

# Destructuring

Simple example:

```javascript
var vals = [1,2];

var [a,b] = vals;

console.log(a); // 1
console.log(b); // 2
```

Object example:

```javascript
var {parse, stringify} = JSON;

console.log(parse); // Function
console.log(stringify); // Function
```

Extract example:

```
let obj = {first: 'Dexter', last: 'McPherson'};

let {first: f, last: l} = obj;

console.log(f,' ', l);
```

Name parameters example:

```javascript
function fun(arg0, {opt1, opts2}) {
    return [opt1, opt2];
}
// {opt1, opt2} is the sames as {opt1:opt1,opt2:opt2}

fun(0,{opt1:'a',opt2:'b'}); // ['a','b']
```

Complex object example:

```javascript
var authors = [
    {
       'name': 'Dav Pilkey',
       'books': [{
           'title': 'Captain Underpants',
           'date': 1997
        }]
   },
   {
       'name': 'Jeff Kinney',
       'books': [{
            'title': 'Diary of a Wimpy Kid',
            'date': 2007
       }]
    }
];

var [{'name': author, 'works': [,{title,date}]}] = authors;

var str = `"${title}", by ${author}, was published in ${date}.`

console.log(str); // '"Captain Underpants", by Dav Pilkey was published in 1997.'
```

Exclude example:

```javascript
var [,a,b] = ['foo','bar','qux'];

console.log(a); // 'bar'
console.log(b); // 'qux'
```

Refutable example:

```javascript
// refutable (default)
{a: x, b: y} = {a: 3}; // fails

// irrefutable
{a: x, ?b: y} = {a: 3}; // x = 3, y = undefined

// default value
{a: x, b: y=5} = {a: 3}; // x = 3, y = 5
```

Rest example:

```javascript
let [x, y, ..rest] = ['a', 'b', 'c', 'd'];
// x = 'a', y = 'b', rest = ['c','d']
```

Arrow function example:

```javascript
var headers = {
    'Content-Type': 'application/json'
}

({'request': {headers}}) => headers

console.log(request['Content-Type']); // 'application/json'
```

# Generators

Simple example:

```javascript
function* zeroOneTwo() {
    yield 0;
    yield 1;
    yield 2;
}

var generator = zeroOneTwo();

for (var i of generator) {
    console.log(i);
}
```

Take example:

```javascript
function* count(start) {
    let i = start || 0;
    while(true) {
        yield i++;
    }
}

function* take(iterable, numToTake) {
    var i = 0;
    for (var taken of iterable) {
        if (i++ === numToTake) {
            return;
        }
        yield taken;
    }
}

for (var i of take(count(10), 5)) {
    console.log(i); // 10, 11, 12, 13, 14
}
```

Iterator example:

```javascript
function* argumentsGenerator() {
    for (let i = 0; i < arguments.length; i += 1) {
        yield arguments[i];
    }
}

var it = argumentsGenerator('a','b','c');

console.log(it.next()); // { value: 'a', done: false }
console.log(it.next()); // { value: 'b', done: false }
console.log(it.next()); // { value: 'c', done: false }
console.log(it.next()); // { value: undefined, done: true}



for (let value of it) {
    console.log(value); // 'a'
}
```

Fibonacci example:

```javascript
function* fibonacci() {
    var previous = 0, current = 1;
    while (true) {
        var temp = previous;
        previous =  current;
        current = temp + current;
        yield current;
    }
}

for (var i of fibonacci()) {
    console.log(i); // 1, 2, ... Infinity
}
```

Fibonacci destructuring example:

```javascript
function* fibonacci() {
    let a = 0, b = 1;

    while(true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

for (let value of fibonacci()) {
    console.log(value);
}

```

Power example:

```javascript
var pow = (function *() {
    return Math.pow(yield 'x', yield 'y');
}());

// first next must be empty to initialize iterator
console.log(pow.next()); // { value: 'x', done: false }
console.log(pow.next(2)); // { value: 'y', done: false }
console.log(pow.next(3)); // { value: 8, done: true }
```

Throw example:

```javascript
function* demo() {
    yield 10;
}

var d = demo();
console.log(d.next()); // value: 10, done: false }
d.throw(new Error('foo')); // Error: foo
```

Value example:

```javascript
function* demo() {
    var res = yield 10;
    return 42;
}

var d = demo();
var resA = d.next();
console.log(resA); // { value: 10, done: false }
var resB = d.next();
console.log(resB); // { value: 42, done: true }
```

# Promises

Simple example:

```javascript
var p = new Promise(function(resolve, reject) {
    resolve('a');
});

Promise.then(function(val) {
    console.log(val); // 'a'
}, function(err) {
    console.error(err);
});
```

`Promise.all` example:

```javascript
var p1 = new Promise(function(resolve, reject) { setTimeout(resolve, 500, 'one'); });
var p2 = new Promise(function(resolve, reject) { setTimeout(resolve, 100, 'two'); });

Promise.all([p1, p2]).then(function(values) {
    console.log(values); // ['one', 'two']
});
```

`Promise.race` example:

```javascript
var p1 = new Promise(function(resolve, reject) { setTimeout(resolve, 500, 'one'); });
var p2 = new Promise(function(resolve, reject) { setTimeout(resolve, 100, 'two'); });

Promise.race([p1, p2]).then(function(value) {
    console.log(value); // 'two'
});
```

Async example:

```javascript
var fs = require('fs');
var path = require('path');
var Promise = require('es6-promise').Promise;

function async(makeGenerator) {
    return function() {
        var generator = makeGenerator.apply(this, arguments);

        function handle(result) {
            if (result.done)  return result.value;

            return result.value.then(function(res) {
                return handle(generator.next(res));
            }, function(err) {
                return handle(generator.throw(err));
            });
        }

        return handle(generator.next());
    };
}

function readJSON(filename) {
    return readFile(filename, 'utf8').then(JSON.parse);
}

function readFile(filename, enc) {
    return new Promise(function(fulfill, reject) {
        fs.readFile(filename, enc, function(err, res) {
            if (err) reject(err);
            else fulfill(res);
        });
    });
}

readJSON(path.resolve('test.json')).then(function(data) {
    console.log(data);
```

# Proxies

Smart array example:

```
function smartArray(arr) {
    return Proxy(
        arr,
        {get: function(p,x) {
            if (Number(x) < 0) {
                return p[p.length + Number(x)];
            }
            return p[x];
        }}
    );
}

var arr = smartArray([1,2,3]);

console.log(arr[0]); // 1
console.log(arr[-1]); // 3
```

Null safe example:

```javascript
var Obj = Function();
var nullProxy = Proxy(
    {toString: ()=> 'nullProxy'},
    {get: (t,p) => t[p] || new Obj() }
);
Obj.prototype = nullProxy;

var sale = Object.create(nullProxy /*, data */);
var lastName = sale.contact.last.name;
console.log(lastName); // 'nullproxy'
```

# Defaults

Simple example:

```javascript
function echo(a=1) {
    console.log(a);
}

echo(); // 1
echo(9); // 9
```

Object example:

```bash
function echo({a=1, b=2, c=3}) {
    console.log(a, b, c);
}

echo(); // 1, 2, 3
echo({a:7,b:8,c:9}); // 7, 8, 9
```

# Maps

Simple example:

```javascript
// map arbitrary values to arbitrary values
let map = new Map();
let obj = {};

map.set(obj, 123);
console.log(map.get(obj)); // 123
console.log(map.has(obj)); // true

map.delete(obj);
console.log(map.has(obj)); // false
```

# Weak Maps

Simple example:

```javascript
let wm = new WeakMap();

let o1 = {};

wm.set(o1, 'a');

console.log(wm.get(o1)); // 'a'



let wm = new WeakMap();

let o1 = {};

wm.set(o1, 'a');

console.log(wm.get(o1)); // 'a'



let o2 = function(){};

wm.set(o2, 'b');

console.log(wm.get(o2)); // 'b'



let o3 = [];

wm.set(o3, 'c');

console.log(wm.get(o3)); // 'c'



let o4 = new WeakMap();

wm.set(o4, 'd');

console.log(wm.get(o4)); // 'd'



let o5 = 'howdy';

wm.set(o5, 'd');

console.log(wm.get(o5)); // TypeError: Invalid value used as weak map key



let o6 = 123;

wm.set(o6, 'e');

console.log(wm.get(o6)); // TypeError: Invalid value used as weak map key



let o7 = null;

wm.set(o7, 'f');

console.log(wm.get(o7)); // TypeError: Invalid value used as weak map key
```

Store example:

```javascript
var storage = new WeakMap();

function store(element, name, value) {
    if (!storage.has(element)) {
        storage.set(element, new WeakMap());
    }

    storage.get(element).set(name, value);
    return element;
}

function retrieve(element, name) {
    if (!storage.has(element)) {
        return;
    }
    return storage.get(element).get(name);
}

function unstore(element, name) {
    if (!storage.get(element)) {
        return;
    }
    let data = storage.get(element);
    let value = data.get(name);
    data.delete(name);
    return value;
}

function clearStore(element) {
    if (!storage.get(element)) {
        return;
    }
    storage.get(element).clear();
}


let el = {}; // Theoretically, this would be a DOM element
let k = {};

store(el, k, 'a');

console.log(retrieve(el, k)); // 'a'

unstore(el, k);

console.log(retrieve(el, k)); // undefined

store(el, k, 'b');

console.log(retrieve(el, k)); // 'b'

clearStore(el);

console.log(retrieve(el, k)); // undefined
```

# Sets

Simple example:

```javascript
let set1 = new Set();
set1.add('hello');
console.log(set1.has('hello')); // true

let set2 = new Set([3,2,1,'a']);
console.log(set2.values()); // 1,2,3,'a'
```

Unique values example:

```javascript
var unique = [...new Set([1, 2, 0, 2, 3, 'A', 'B', 0, 'C', 'C', 'D'])];

console.log(unique); // [1, 2, 0, 3, 'A', 'B', 0, 'C', 'D']
```

# Symbols

Simple example:

```javascript
let specialMethod = Symbol();
let obj = {
    // computed property key
    [specialMethod]: function(arg) {

    }
};
obj[specialMethod](123);


// short method definition
let obj = {
    [specialMethod](arg) {

    }
};

```

# Shorthand objects

```javascript
var name = 'Dexter';
var occupation = 'Scientist';

var result = {name, occupation};

console.log(result); // {name: 'Dexter', occupation: 'Scientist}
```

# Spread operator

Simple example:

```javascript
Math.max(...[7,11,4]); // 11
```

Another example:

```javascript
function f(x,y,z) {
    console.log(arguments);
}

var args = [0,1,2];

f(...args);




function g(a,b,c,d,e) {
    console.log(arguments);
}

var nums = [1,2,3];

g(0, ...nums, 4);
```

# Rest operator

Arguments example:

```
let sum = (...numbers) =>
    numbers.reduce((a,b) => a + b);
```


// Equivalent to Math.max.apply(null, [4,2,6])
console.log(Math.max(...[4,2,6]));

# Constants

Simple example:

```javascript
const CANT_TOUCH_THIS = 'foo';

console.log(CANT_TOUCH_THIS);

CANT_TOUCH_THIS = 'bar'; // SyntaxError: Assignment to constant variable.
```

Invalid example:

```
function f() {
    // with this in place..
    const g = false;

    // you can't do this
    const g = true; // SyntaxError: Variable 'g' has already been declared

    // or this
    g = true; // SyntaxError: Assignment to constant variable.

    // or this
    var g = false; // SyntaxError: Variable 'g' has already been declared

    // or this
    let g = false; // SyntaxError: Variable 'g' has already been declared
}

f();
```

# Block scoping

Simple example:

```javascript
{
    let privateKey = Math.random();
    console.log(privateKey); // 0.8486106356140226
}
```

Reference error:

```javascript
if (false) {
    var value = 'foo';
    function getValue() {
        return value;
    }
}

getValue(); // ReferenceError: getValue is not defined
```

# Template Strings

Simple example:

```javascript
var x = 2;
var y = 3;

var equation = `${x} + ${y} = ${x + y}`

console.log(equation); // "2 + 3 = 5"
```

Object literal example:

```javascript
var toaster  = {
    food: null,
    toast() {
        return `toasting ${this.food}`;
    }
}

var toaster1 = Object.create(toaster);
var toaster2 = Object.create(toaster);

toaster1.food = 'toast';
toaster2.food = 'bagels';

console.log(toaster1.toast()) // 'toasting toast'
console.log(toaster2.toast()) // 'toasting bagels'
```

Escape example:

```javascript
function escape(values, ...substitutions) {
    let {raw, raw: {length}} = values, results = '';
    for (let index = 0; index < length; index++) {
        results += raw[index];
        if (index + 1 == length) {
            break;
        }
        results += String(substitutions[index].replace(/[&<>"'/g,
            (match) => `&#x${match.charCodeAt((0).toString(16)};`)
    }
    return results;
}
let name = 'Kit<script>alert(1)</script>';
escape`<span class="name">${name}</span>`;
// '<span class="name">Kit&#x3c;script&#x3e;alert(1)&#x3c;/script&#3e;</span>'
```

# Conclusion

You can start using ES6 features today. [Addy Osmani](http://addyosmani.com/) has a [great list of ES6 Tools](https://github.com/addyosmani/es6-tools) for transpiling your ES6 code to ES5 so that you can code in the future, while browsers catch up in implementing the spec. You can find all the code examples and more in my [es6-examples repo](https://github.com/miguelmota/es6-examples).


What's your favorite ES6 feature?
