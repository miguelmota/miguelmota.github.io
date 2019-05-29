---
layout: blog-post
title: Sass Triangles
type: blog
tag: [Sass, CSS, mixins]
description: A Sass mixin for creating triangles.
date: 2013-05-04T00:00:00-00:00
draft: false
---
Creating CSS triangles shouldn't be hard.

Here's a handy little mixin for creating triangles in Sass ([gist](https://gist.github.com/miguelmota/5327822)):

```css
@mixin triangle($size:24px, $color:#000, $direction:up, $trim:false, $transparent:false) {
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  border: solid $size;
  @if $direction == up {
    border-color: transparent transparent $color transparent;
    @if $transparent {
      border-color: $color $color transparent $color;
    }
    @if $trim {
      border-top-width: 0;
    }
  }
  @if $direction == right {
    border-color: transparent transparent transparent $color;
    @if $transparent {
      border-color: $color $color $color transparent ;
    }
    @if $trim {
      border-right-width: 0;
    }
  }
  @if $direction == down {
    border-color: $color transparent transparent transparent;
    @if $transparent {
      border-color: transparent $color $color $color;
    }
    @if $trim {
      border-bottom-width: 0;
    }
  }
  @if $direction == left {
    border-color: transparent $color transparent transparent;
    @if $transparent {
      border-color: $color transparent $color $color;
    }
    @if $trim {
      border-left-width: 0;
    }
  }
}
```