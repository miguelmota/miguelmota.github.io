A *Hashmap`* is an implmentation of *Map*. A Map maps keys to values. Hashmap does not allow duplicate keys but can have duplicate values.

new Map

hashtable and hash map are interchange in JavaScript.

In JavaScript, you can use a POJO for this

```javascript
var hashmap = {
  foo: 'bar'
};

hashmap['baz'] = 'qux';
```

A Hashtable is an implmentation of a Map that uses a hash function to compute an index into an array of buckets from wihc the value can be found. Keys do not have to be strings. Cannot have duplicate keys.

function Point(x, y) {
    this.x = x;
    this.y = y;
}

var coloursForPoints = new Hashtable();

function getColourAt(x, y) {
    var point = new Point(x, y);
    return coloursForPoints.get(point);
}

coloursForPoints.put( new Point(1, 2), "green" );

alert( getColourAt(1, 2) ); // Alerts null

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.equals = function(obj) {
    return (obj instanceof Point) &&
        (obj.x === this.x) &&
        (obj.y === this.y);
};

var coloursForPoints = new Hashtable();

function getColourAt(x, y) {
    var point = new Point(x, y);
    return coloursForPoints.get(point);
}

coloursForPoints.put( new Point(1, 2), "green" );

alert( getColourAt(1, 2) ); // Alerts "green"
Point.prototype.hashCode = function(obj) {
    return "Point:" + this.x + "," + this.y;
};


key -> hash fn -> bucket (slot)

Hashtable constructor to generate hash codes and test key equality


when put is called it hashes the key an places it into an array of buckets for that particular hash code. It then searches the contents of the buckets for the particular key. Most fastest when having one bucket per hash code.

A *Hashset* is an implmentation of *Set*. A set is like a map except it only stores the keys. A set cannot have duplicate keys. You only store keys.

add intersection and union methods, isSubset of, complement


A dictionary is another term for Map.


Two terms for the same thing

"Map" is used by Java, C++
"Dictionary" is used by .Net, Python
"Associative array" is used by Javascript, PHP

time complexity
