no side effects
no state

talk about tail-call optimization
"stack overflow"

Square of integers

imperative

```javascript
for (var i = 0; i < 20; i++) {
  console.log(n, n*n)
}
```

functional, this ex uses recursion

```javascript
printSquares(20);

function printSquares(n) {
  if (n > 0) {
    printSquares(n-1);
    console.log(n, n*n)
  }
}
```

Substituion Model: you can replace a function call with it's implementation

```javascript
if (20 > 0) {
  if (19 > 0) {
    printsquares(19-1); // an so on
    console.log(19, 19*19);
  }
  console.log(20, 20*20):
}
```

if you introduce assignment statements you can no longer replace calls with implementation.

first class citizens, can be treated like data. assigned to variables, passed as args. have properties like objects.

A higher-order function is a function that does at least

  * Take one or more functions as an input
  * Output a function

All other functions are first order functions. [1]

//no
forloop

// yes
 function repeat(operation, num) {
   if (num <= 0) return
   operation()
   return repeat(operation, --num)
 }

//no
    function doubleAll(numbers) {
      var result = []
      for (var i = 0; i < numbers.length; i++) {
        result.push(numbers[i] * 2)
      }
      return result
    }

//yes
function doubleAll(numbers) {
  return numbers.map(function(n) {
    return n * 2;
  });
}


  return messages.map(function(msg) {¬
    return msg.message;¬
  }).filter(function(msg) {¬
    return msg.length < 50;¬
  });¬


https://github.com/timoxley/functional-javascript-workshop
