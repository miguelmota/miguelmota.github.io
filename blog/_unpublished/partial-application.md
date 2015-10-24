function add(x, y) {
  return x + y;
}

var plus1 = add.bind(null, 1);
console.log(plus1(5)); // 6

basically

function plus1(y) {
  return add(1, y);
}
