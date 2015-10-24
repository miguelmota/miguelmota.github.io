
```javascript
(function(global) {
  function yoyo(fn /*, args*/) {
    var result,
    __slice = Function.prototype.call.bind([].slice),
    args = __slice(arguments, 1),
    arity = fn.length;

    function ret(args) {
      result = fn.apply(fn, args);
      while (result instanceof Function) {
        result = result();
      }
      return result;
    }

    function given(args) {
      return function(/* args */) {
        args = args.concat(__slice(arguments));
        return args.length >= arity ? ret(args) : given(args);
      };
    }

    return args.length < arity ? given([]) : ret(args);
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = yoyo;
    }
    exports.yoyo = yoyo;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return yoyo;
    });
  } else {
    global.yoyo = yoyo;
  }
})(this);
```

https://github.com/miguelmota/yoyo
