---
layout: byte
title: How to use Battery Status API
type: bytes
tag: [JavaScript]
description: A wrapper for the Battery Status API.
date: 2015-01-08T00:00:00-00:00
draft: false
---
Battery Status API wrapper:

```javascript
function Battery() {
  observable(this);

  if (typeof navigator.getBattery !== 'function') {
    navigator.getBattery = function () {
      return new Promise(function (resolve, reject) {
        if (navigator.battery) {
          resolve(navigator.battery);
        } else {
          reject(new Error('Battery Status API not implemented.'));
        }
      });
    };
  }

  navigator.getBattery().then(function(batteryManager) {
    this._battery = batteryManager;
    this.trigger('ready', this);
    this._battery.addEventListener('chargingchange', function() {
      this.trigger('chargingChange', this.isCharging());
    }.bind(this));
    this._battery.addEventListener('chargingtimechange', function() {
      this.trigger('chargingTimeChange', this.getChargingTime());
    }.bind(this));
    this._battery.addEventListener('dischargingtimechange', function() {
      this.trigger('dischargingTimeChange', this.getDischargingTime());
    }.bind(this));
    this._battery.addEventListener('levelchange', function() {
      this.trigger('levelChange', this.getLevel());
    }.bind(this));
  }.bind(this), function(error) {
    this.trigger('error', error);
  }.bind(this));
}

Battery.prototype.getLevel = function() {
  return this._battery.level;
};

Battery.prototype.getPercentage = function() {
  return this.getLevel() * 100;
};

Battery.prototype.isCharging = function() {
  return this._battery.charging;
};

Battery.prototype.isDischarging = function() {
  return !this.isCharging();
};

Battery.prototype.getChargingTime = function() {
  var chargingTime = this._battery.chargingTime;
  return Number.isFinite(chargingTime) ? chargingTime : 0;
};

Battery.prototype.getDischargingTime = function() {
  var dischargingTime = this._battery.dischargingTime;
  return Number.isFinite(dischargingTime) ? dischargingTime : 0;
};

Battery.prototype.getStatus = function() {
  return this.isCharging() ? 'charging' : 'discharging';
};

function observable(el) {
  var callbacks = {};

  el.on = function(name, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Second argument for "on" method must be a function.');
    }
    (callbacks[name] = callbacks[name] || []).push(fn);
    return el;
  };

  el.one = function(name, fn) {
    fn.one = true;
    return el.on.call(el, name, fn);
  };

  el.off = function(name, fn) {
    if (name === '*') return (callbacks = {}, callbacks);
    if (!callbacks[name]) return;
    if (fn) {
      if (typeof fn !== 'function') {
        throw new TypeError('Second argument for "off" method must be a function.');
      }
      callbacks[name] = callbacks[name].map(function(fm, i) {
        if (fm === fn) {
          callbacks[name].splice(i, 1);
        }
      });
    } else {
      delete callbacks[name];
    }
  };

  el.trigger = function(name) {
    if (!callbacks[name]) return;
    var args = [].slice.call(arguments, 1);

    callbacks[name].forEach(function(fn, i) {
      if (fn) {

        fn.apply(fn, args);
        if (fn.one) callbacks[name].splice(i, 1);
      }
    });
    return el;
  };

  return el;
}

var battery = new Battery();
```

Usage:

```javascript
battery.on('ready', function() {
  console.log('isCharging: ' + battery.isCharging()); // true
  console.log('isDischarging: ' + battery.isDischarging()); // false
  console.log('getChargingTime: ' + battery.getChargingTime()); // 5220 (seconds)
  console.log('getDischargingTime: ' + battery.getDischargingTime()); // 0
  console.log('getLevel: ' + battery.getLevel()); // 0.54
  console.log('getPercentage: ' + battery.getPercentage()); // 54
  console.log('getStatus: ' + battery.getStatus()); // 'charging'
});

battery.on('chargingChange', function(isCharging) {
  console.log(isCharging);
});

battery.on('chargingTimeChange', function(chargingTime) {
  console.log(chargingTime);
});

battery.on('dischargingTimeChange', function(dischargingTime) {
  console.log(dischargingTime);
});

battery.on('levelChange', function(level) {
  console.log(level);
});

battery.on('error', function(error) {
  console.error(error);
});
```

On github at [miguelmota/battery](https://github.com/miguelmota/battery).
