---
layout: blog-post
title: Bitwise operators in JavaScript
category: blog
tags: [JavaScript, operators, bitwise]
short_url: mig.gs/nZi7
description: Interesting things you can do with bitwise operators.
---

[Bitwise operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) act on the level of individual bits which allows for fast comparisons and calculations. I'll be going over a couple of ways to use bitwise opeartors in JavaScript since it's not entirely clear at first. Some of the examples shown are from various sources which I've accumlated over time in which I'm going to elaborate on them.

# Bitwise AND

***Return a one if the two bits are both one.***

{% highlight javascript %}
5 & 7 // 5

00000101 // 5
00000111 // 7
--------
00000101 // 5
{% endhighlight%}

[JSBin example](http://jsbin.com/fedim/1/edit)

**Check if number is even or odd:**

{% highlight javascript %}
((n & 1) === 0) // true if even

((1 & 1) === 0) // false
((2 & 1) === 0) // true

The how:

// 1 & 1
00000001 // 1
00000001 // 1
--------
00000001 // 1 (odd)

// 2 & 1
00000010 // 2
00000001 // 1
--------
00000000 // 0 (even)
{% endhighlight %}

[JSBin example](http://jsbin.com/vawero/1/edit)

**Get the difference between two hex values:**

{% highlight javascript %}
var a = 0xF0; // 240
var b = 0xFF; // 255

a & b // 240
~a & b // 15 is the difference

The how:

(240).toString(2) // "11110000"
(255).toString(2) // "11111111"

11110000 // 240
11111111 // 255
--------
11110000 // 240

(~240).toString(2) // "-11110001"
(~240 >>> 0).toString(2) // "11111111111111111111111100001111"

00001111 // ~240 = -241
11111111 // 255
--------
00001111 // 15

The tilde "~" is the bitwise NOT which inverts the bits.
">>>" is the zero-fill right shift operator which converts to a 32 bit unsigned value.

Another way to look at it:

NOT(F0) && FF = 0F && FF = 0F

(240 >>> 0).toString(16) // "f0"
(255 >>> 0).toString(16) // "ff"

~('0xF0' >>> 0) // -241
(-241 >>> 0).toString(16) // "ffffff0f"

FFFFFF0F // -241
000000FF // 255
--------
0000000F // 15
{% endhighlight%}

[JSBin example](http://jsbin.com/cewiqi/1/edit)

# Bitwise OR

***Return a one if one of the two bits is a one.***

{% highlight javascript %}
5 | 7 // 7

The how:

00000101 // 5
00000111 // 7
--------
00000111 // 7
{% endhighlight %}

[JSBin example](http://jsbin.com/wokuc/1/edit)

**Fast truncation:**

{% highlight javascript %}
1.4 | 0 // 1
-1.4 | 0 // -1
{% endhighlight %}

[JSBin example](http://jsbin.com/ranuzo/1/edit)

**Mask a flag additively:**

{% highlight javascript %}
var mask = 0x0003;
var flag = 0xFFF0;
var result = flag | mask; // 65523
result.toString(16); // "fff3"

The how:

0000000000000011 // 3
1111111111110000 // 65520
----------------
1111111111110011 // 65523

(65523).toString(16); // "fff3"
{% endhighlight %}

[JSBin example](http://jsbin.com/boyuni/1/edit)

**Mask a flag subtractively:**

{% highlight javascript %}
var mask = 0x0003;
var flag = 0xFFFF;
var result = flag & ~mask;
result.toString(16); // "fffc"

The how:

(0x003 >>> 0).toString(2)
// 0000000000000000000000000000011

(~0x003 >>> 0).toString(2)
// 1111111111111111111111111111100

0000000000000011 // 0x003
1111111111111100 // ~0x003
-------------------------------
1111111111111100

1111111111110011 // 65523

parseInt('1111111111110011', 2); // 65523

(65523).toString(16); // "fffc"
{% endhighlight %}

[JSBin example](http://jsbin.com/muzilo/1/edit)

# Bitwise XOR

***Return a one if either bit is a one or zero but not both.***

{% highlight javascript %}
5 ^ 7 // 2

The how:

00000101 // 5
00000111 // 7
--------
00000010 // 2
{% endhighlight %}

[JSBin example](http://jsbin.com/fokeda/1/edit)

**Variable swap:**

{% highlight javascript %}
var a = 1,
    b = 2;

a = a ^ b;
b = b ^ a;
a = a ^ b;

// shorthand

a ^= b;
b ^= a;
a ^= b;

// b = 1, a = 2

The how:

'a'.charCodeAt(0) // 97
'b'.charCodeAt(0) // 98

(97).toString(2) // 1100001
(98).toString(2) // 1100010

// a ^= b;
1100001 // 97 (a)
1100010 // 98 (b)
-------
0000011 // 3 (a)

// b ^= a;
1100010 // 98 (b)
0000011 // 3 (a)
-------
1100001 // 97 (b)

// a ^= b;
0000011 // 3 (a)
1100001 // 97 (b)
-------
1100010 // 98 (a)

String.fromCharCode(97); // b = 'a'
String.fromCharCode(98); // a = 'b'
{% endhighlight %}

[JSBin example](http://jsbin.com/mexowu/1/edit)

**Toggle switch:**

{% highlight javascript %}
var a = 1;

a = a ^ 1; // 0
a = a ^ 1; // 1
a = a ^ 1; // 0

// shorthand

a ^= 1; // 0
a ^= 1; // 1
a ^= 1; // 0

The how:

a ^= 1;
00000001 // 1 (a)
00000001 // 1
--------
00000000 // 0 (a)

a ^= 1;
00000000 // 1 (a)
00000001 // 1
--------
00000001 // 1 (a)

a ^= 1;
00000001 // 1 (a)
00000001 // 1
--------
00000000 // 0 (a)
{% endhighlight %}

[JSBin example](http://jsbin.com/duliza/1/edit)

Determine if two integers have opposite signs:

{% highlight javascript %}
var x = 1,
    y = -1;

((x ^ y) < 0); // true
{% endhighlight %}

[JSBin example](http://jsbin.com/nucoz/1/edit)

# Bitwise NOT

***Inverts the bits.***

{% highlight javascript %}
[x = -(x + 1)]

~5 // -6

The how:

-6 = -(5 + 1)

(5).toString(2)
00000101

// two's complement
(~5 >>> 0).toString(2)
11111111111111111111111111111010
{% endhighlight %}

[JSBin example](http://jsbin.com/nagigi/1/edit)

**Shorthand `indexOf`:**

{% highlight javascript %}
!!~[1].indexOf(2) // false
!!~[1].indexOf(1) // true

The how:

[1].indexOf(2) // -1
[1].indexOf(1) // 0

~-1 // 0
~0 // -1

!!0 // false
!!-1 // true
{% endhighlight %}

[JSBin example](http://jsbin.com/bogeq/1/edit)

# Bitwise double NOT

**Fast truncation:**

{% highlight javascript %}
// for positive numbers it can be a faster substitute for Math.floor()
~~(5.3) // 5

// negative truncation
~~(-5.3) // -5

// If it can't be parsed to a number than result will always be zero
~~('foo') // 0
~~({}) // 0
{% endhighlight %}

[JSBin example](http://jsbin.com/wawuzi/2/edit) | [jsPerf test](http://jsperf.com/math-floor-vs-bitwise-double-not)

# Shift operators

***Shift bits a specified number of bit positions.***

{% highlight javascript %}
8 >> 1 // 4
8 >> 2 // 2

8 << 1 // 16
8 << 2 // 32

The how:

// 8 >> 1
00001000 // 8
00000100 // 4

// 8 >> 2
00001000 // 8
00000010 // 2

// 8 << 1
00001000 // 8
00010000 // 16

// 8 << 2
00001000 // 8
00100000 // 32
{% endhighlight %}

[JSBin example](http://jsbin.com/nutoc/1/edit)

**Decimal to Integer:**

{% highlight javascript %}
4.12 >> 0 // 4
4.12 << 0 // 4

-4.12 >> 0 // -4
-4.12 << 0 // -4
{% endhighlight %}

[JSBin example](http://jsbin.com/tunenu/1/edit)

**Integer multiplication and division:**

{% highlight javascript %}
// 20 * 2
20.5 << 1 // 40

// 20 / 2
20.5 >> 1 // 10
{% endhighlight %}

[JSBin example](http://jsbin.com/jimaqu/1/edit)

**Hex to RGB:**

{% highlight javascript %}
var hex = '00FF99';
var dec = parseInt(hex, 16); // 65433

var rgb = {};
rgb.r = (dec >> 16) & 0xFF; // 0
rgb.g = (dec >> 8) & 0xFF; // 255
rgb.b = (dec) & 0xFF; // 153

The how:

// rgb.b
(65433).toString(2)
1111111110011001

parseInt('ff', 16) // 255
00000000011111111

1111111110011001 // 65433
0000000011111111 // 255
---------------
0000000010011001

parseInt('10011001', 2) // 153
{% endhighlight %}

[JSBin example](http://jsbin.com/volayo/1/edit)

**RGB to Hex:**

{% highlight javascript %}
var r = 0, g = 255, b = 153;

var hex = '#' +
          (
              (1 << 24) +
              (r << 16) +
              (g << 8) + b
          )
          .toString(16)
          .substr(1);

hex // "#00ff99"
{% endhighlight %}

[JSBin example](http://jsbin.com/sijapi/1/edit)

# Zero-fill Right Bit Shifting

***Shifts the operand a specified number of bits to the right and zero bits are shifted in from the left. Sign bit is zero so result is always a 32-bit unsigned integer.***

{% highlight javascript %}
5 >>> 0 // 5
"5" >>> 0 // 5
"hello" >>> 0 // 0
-2 >>> 0 // 4294967294
3.6 >>> 0 // 3
true >>> 0 // 1
0xFF >>> 1 // 127

The how:

5 >>> 0
00000101 // 5

-2 >>> 0
11111111111111111111111111111110 // 4294967294

0xFF >>> 1
parseInt('0xFF', 16).toString(2)
111111111 // 255
011111111 // 127
{% endhighlight %}

[JSBin example](http://jsbin.com/nalev/1/edit)

# Getting creative

**Finding the smallest number:**

{% highlight javascript %}
var x = 9;
var y = 5;

var smallest = y ^ ((x ^ y) & -(x < y));

smallest // 5
{% endhighlight %}

[JSBin example](http://jsbin.com/leses/1/edit)

**Finding the largest number:**

{% highlight javascript %}
var x = 9;
var y = 5;

var largest = x ^ ((x ^ y) & -(x < y));

largest // 5
{% endhighlight %}

[JSBin example](http://jsbin.com/tecubo/1/edit)

**If number is power of 2:**

{% highlight javascript %}
var v = 8;

var isPowerOf2 = v && !(v & (v - 1));

isPowerOf2 // true
{% endhighlight %}

[JSBin examples](http://jsbin.com/miwil/1/edit)

Examples stolen from [Bit Twiddling Hacks](http://graphics.stanford.edu/~seander/bithacks.html) by Sean Eron Anderson.

**Create array of bits of a number:**

{% highlight javascript %}
var index, bitMask;
var num = 5;

var array = [];
for (bitMask = 128, index = 0; bitMask > 0; bitMask >>= 1, index++) {
  array.push((bitMask & num ? 1 : 0 ));
}

array // [0, 0, 0, 0, 0, 1, 0, 1]
{% endhighlight %}

[JSBin example](http://jsbin.com/fuwop/1/edit)

Stolen from [Getting Bitwise with JavaScript](http://bocoup.com/weblog/getting-bitwise-with-javascript/) by Rebecca Murphey.

# Conversions

**Binary to Decimal:**

{% highlight javascript %}
function binaryToDecimal(binaryString) {
    return parseInt(binaryString, 2);
}

binaryToDecimal('11111111'); // 255
{% endhighlight %}

[JSBin example](http://jsbin.com/guwas/1/edit)

**Decimal to Binary:**

{% highlight javascript %}
function decimalToBinary(decimal) {
    return (decimal >>> 0).toString(2);
}

decimalToBinary(255); // "11111111"
{% endhighlight %}

[JSBin example](http://jsbin.com/hogoxi/1/edit)

**Decimal to Hexadecimal:**

{% highlight javascript %}
function decimalToHex(decimal) {
    return (decimal).toString(16);
}

decimalToHex(255); // "FF"
{% endhighlight %}

[JSBin example](http://jsbin.com/jixaca/1/edit)

**Hexadecimal to Decimal:**

{% highlight javascript %}
function hexToDecimal(hex) {
    return parseInt(hex, 16);
}

hexToDecimal('FF'); // 255
{% endhighlight %}

[JSBin example](http://jsbin.com/waqixi/1/edit)

**Binary to Hexadecimal:**

{% highlight javascript %}
function binaryToHex(binaryString) {
    return parseInt(binaryString, 2).toString(16);
}

binaryToHex('11111111'); // "ff"
{% endhighlight %}

[JSBin example](http://jsbin.com/hiyox/1/edit)

**Hexadecimal to Binary:**

{% highlight javascript %}
function hexToBinary(hex) {
    return (parseInt(hex, 16)).toString(2);
}

hexToBinary('FF'); // "11111111"
{% endhighlight %}

[JSBin example](http://jsbin.com/qijul/1/edit)

**Binary to Character:**

{% highlight javascript %}
function binaryToChar(binaryString) {
    return String.fromCharCode(parseInt(binaryString, 2));
}

binaryToChar('01000001'); // "A"
{% endhighlight %}

[JSBin example](http://jsbin.com/qufisi/1/edit)

**Character to Binary:**

{% highlight javascript %}
function charToBinary(char) {
    return (char.charCodeAt(0)).toString(2);
}

charToBinary('A'); // "01000001"
{% endhighlight %}

[JSBin example](http://jsbin.com/qavun/1/edit)

# Conclusion

Bitwise operators can definitely improve performance of your application    since they are much faster than using built in methods. The only downside is it makes the code a little less unreadable. But it's well worth it.

I'd love to see other creative uses of bitwise operators, share if you may.

<!--
var permissions,
    CREATE = 1 << 0,  // 0001
    READ = 1 << 1,    // 0010
    UPDATE = 1 << 2,  // 0100
    DELETE = 1 << 3,  // 1000
    CRUD = CREATE ^ READ ^ UPDATE ^ DELETE; // 1111

// Set permissions to full CRUD
permissions |= CRUD;
alert(permissions.toString(2)); // 1111

// Remove DELETE permission
permissions &= ~DELETE;
alert(permissions.toString(2)); // 0111

// Toggle CREATE permissions
permissions ^= CREATE;
alert(permissions.toString(2)); // 0110

permissions ^= CREATE;
alert(permissions.toString(2)); // 0111

// Check READ permissions
if (permissions & READ) // 1 (truthy)
{
    alert('Read all the things...');
}
-->
