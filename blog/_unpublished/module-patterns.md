# Sandbox

page 104
```javascript
Sandbox.modules = {};

Sandbox.modules.dom = function(box) {
  box.getElement = function() {};
};

Sandbox.modules.event = function(box) {
  box.attachEvent = function() {};
  box.detachEvent = function() {};
};

Sandbox.modules.ajax = function(box) {
  box.makeRequest = function() {};
};

function Sandbox() {
  var args = Array.prototype.slice.call(arguments),
}
```

# Static members
page 106
