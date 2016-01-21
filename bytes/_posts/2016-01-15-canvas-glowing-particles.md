---
layout: byte
title: How to create glowing particles in canvas
category: bytes
tags: [canvas, JavaScript]
description: How to create glowing particles in canvas.
---
Create glowing particles in canvas.

`Particle.js`:

```javascript
(function(root) {
  'use strict';

  function Particle(options) {
    var defaults = {
      ttl: 8000,
      maxXSpeed: 5,
      maxYSpeed: 2,
      maxRadius: 20,
      xVelocity: 4,
      yVelocity: 4,
      random: false,
      blink: true,
      speed: 30,
      containerWidth: window.innerWidth,
      containerHeight: window.innerHeight,
      context: null
    };

    var settings = merge(defaults, options);
    for (var name in settings) {
      this[name] = settings[name];
    }

    this.xStart =  this.containerWidth / 2;
    this.yStart = this.containerHeight / 2;

    if (!(this.context instanceof Object)) {
      throw new Error('Canvas `context` is required.');
    }
  }

  Particle.prototype.reset = function() {
    // position
    this.x = (this.random ? this.containerWidth * Math.random() : this.xStart);
    this.y = (this.random ? this.contaienrHeight * Math.random() : this.yStart);

    // size
    this.r = ((this.maxRadius - 1) * Math.random()) + 1;

    // speed and direction
    this.dx = (Math.random() * this.maxXSpeed) * (Math.random() < 0.5 ? -1 : 1);
    this.dy = (Math.random() * this.maxYSpeed) * (Math.random() < 0.5 ? -1 : 1);

    // half-life
    this.hl = (this.ttl / this.speed) * (this.r / this.maxRadius);

    // ratio of max speed and full opacity
    // opacity starting place (closer to hl the dimmer)
    this.rt = Math.random() * this.hl;

    console.log(this.hl)
    console.log(this.rt);

    // opacity rate
    this.rtt = Math.random() + 1;

    // stop
    this.stop = Math.random() * 0.2 + 0.4;

    // constant velocity
    this.xVelocity *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
    this.yVelocity *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
  };

  Particle.prototype.fade = function() {
    this.rt += this.rtt;
  };

  Particle.prototype.draw = function() {
    // Invert fade if at the min or max level
    if (this.blink && (this.rt <= 0 || this.rt >= this.hl)) {
      this.rtt = this.rtt * -1;
    } else if (this.rt >= this.hl) {
      this.reset();
    }

    var opacity = 1 - (this.rt / this.hl);

    this.context.beginPath();
    this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    this.context.closePath();

    var cr = this.r * opacity;

    var colorStop1 = '255,255,255';
    var colorStop2 = '10,43,55';
    var colorStop3 = '23,30,32';

    var gradient = this.context.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr <= 0 ? 1 : cr));
    gradient.addColorStop(0, 'rgba('+ colorStop1 + ',' + opacity + ')');
    gradient.addColorStop(this.stop, 'rgba('+ colorStop2 + ',' + (opacity * 0.6) + ')');
    gradient.addColorStop(1.0, 'rgba('+ colorStop3 + ',0)');

    this.context.fillStyle = gradient;
    this.context.fill();
  };

  Particle.prototype.move = function() {
    this.x += (this.rt / this.hl) * this.dx;
    this.y += (this.rt / this.hl) * this.dy;

    if (this.x > this.containerWidth || this.x < 0) {
      this.dx *= -1;
    }

    if (this.y > this.containerHeight || this.y < 0) {
      this.dy *= -1;
    }
  };

  function merge(obj1, obj2) {
    var result = {};
    for (var attrname in obj1) {
      result[attrname] = obj1[attrname];
    }

    for (var attrname in obj2) {
      result[attrname] = obj2[attrname];
    }
    return result;
  }

  root.Particle = Particle;
})(this);
```

`index.js`:

```javascript
(function() {
  'use strict';

  var particleCount = 52;
  var particles = [];
  var speed = 60;

  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  for (var i = 0; i < particleCount; i++) {
    particles[i] = new Particle({
      ttl: 20000,
      speed: speed,
      maxRadius: 60,
      containerWidth: width,
      containerHeight: height,
      context: context
    });

    particles[i].reset();
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      particles[i].fade();
      particles[i].move();
      particles[i].draw();
    }
  }

  var interval = setInterval(draw,speed);

})();
```

`index.css`:

```css
html,
body,
canvas {
  width: 100%;
  height: 100%;
}

body {
  background: #000;
}
```

`index.html`:

```html
<link rel="stylesheet" href="./index.css" />

<canvas id="canvas"></canvas>

<script src="./particle.js"></script>
<script src="./index.js"></script>
```

On github at [miguelmota/canvas-particles](https://github.com/miguelmota/canvas-particles).
