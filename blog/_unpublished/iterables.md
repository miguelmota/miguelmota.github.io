function iterateOver(...values) {
  let index = 0;
  let iterable = {
    [Symbole.iterator]() {
      let iterator = {
        next() {
          if (index < values.length) {
            return {value: values[index++]};
          } else {
            return {done: true};
          }
        }
        return iterator;
      };
    }
  };
  return iterable;
}

for (let x of iterateOver('eeny', 'meeny', 'miny')) {
  console.log(x);
}
