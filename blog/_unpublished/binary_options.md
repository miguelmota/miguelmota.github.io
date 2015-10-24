---
layout: blog-post
title: Using
category: blog
tags: [JavaScript, binary]
description:
---



var direction = 2;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
  console.log('true')
} else {
  console.log('false')
}

var direction = 'left';

var DIRECTION_NONE = 'none';
var DIRECTION_LEFT = 'left';
var DIRECTION_RIGHT = 'right';
var DIRECTION_UP = 'up';
var DIRECTION_DOWN = 'down';

var DIRECTION_HORIZONTAL = DIRECTION_LEFT || DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP || DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL || DIRECTION_VERTICAL;

if (direction === DIRECTION_HORIZONTAL || direction === DIRECTION_VERTICAL) {
  console.log('true');
} else {
  console.log('false');
}
