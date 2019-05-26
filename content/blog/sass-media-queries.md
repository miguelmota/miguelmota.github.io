---
layout: blog-post
title: Sass Media Queries
type: blog
tags: [Sass, CSS, media queries, mixins]
description: Sass media queries to set breakpoints.
date: 2013-04-06T00:00:00-00:00
draft: false
---
There are various methods of setting breakpoints in [Sass](http://sass-lang.com/). The first method, which I use, is heavility inspired by [Chris Eppstein's selector hacks](https://gist.github.com/chriseppstein/1215856). The second method is how [ZURB's Foundation 4](http://foundation.zurb.com/docs/media-queries.html) breakpoints are set.

Here is the [gist](https://gist.github.com/miguelmota/5316827):

```css
// Sass Media Query Breakpoints

//
// METHOD 1
//
// Inspired by http://thesassway.com/intermediate/responsive-web-design-in-sass-using-media-queries-in-sass-32
//
// Usage:
//
// div {
//  color: blue;
//
// 	@include respond-to(mobile) {
// 	    color: red;
//   }
//
// }
//

$break-mobile: 640px;
$break-desktop: 1024px;

@mixin respond-to($media) {
  @if $media == mobile {
    @media only screen and (max-width: $break-mobile) { @content; }
  }
  @else if $media == tablet {
    @media only screen and (min-width: $break-mobile + 1) and (max-width: $break-desktop - 1) { @content; }
  }
  @else if $media == desktop {
    @media only screen and (min-width: $break-desktop) { @content; }
  }
}

//
// METHOD 1 (extended)
//
// Inspired by https://gist.github.com/chriseppstein/1215856
//
// Usage:
//
// div {
//  color: blue;
//
// 	@include respond-to(mobile) {
// 	    color: red;
//   }
//
// }
//

$mobile-small-max-size: 320px !default;
$mobile-max-size: 640px !default;
$tablet-min-size: 768px !default;
$tablet-max-size: 979px !default;
$desktop-min-size: 979px !default;
$desktop-large-min-size: 1200px !default;

@mixin respond-to($media) {
  @if $media == mobile-small {
          @media only screen and (max-width: $mobile-small-max-size) { @content; }
  }
  @else if $media == mobile {
          @media only screen and (max-width: $mobile-max-size) { @content; }
  }
  @else if $media == mobile-portrait {
          @media only screen and (max-width: $mobile-max-size) and (orientation: portrait) { @content; }
  }
  @else if $media == mobile-landscape {
          @media only screen and (max-width: $mobile-max-size) and (orientation: landscape) { @content; }
  }
  @else if $media == mobile-tablet {
          @media only screen and (max-width: $tablet-max-size) { @content; }
  }
  @else if $media == tablet {
          @media only screen and (min-width: $tablet-min-size) and (max-width: $tablet-max-size) { @content; }
  }
  @else if $media == tablet-landscape {
          @media only screen and (min-width: $tablet-max-size) and (orientation: landscape) { @content; }
  }
  @else if $media == tablet-desktop {
          @media only screen and (min-width: $tablet-max-size) { @content; }
  }
  @else if $media == desktop {
          @media only screen and (min-width: $desktop-min-size) { @content; }
  }
  @else if $media == desktop-large {
          @media only screen and (min-width: $desktop-large-min-size) { @content; }
  }
}

//
// METHOD 2
//
// Inspired by http://foundation.zurb.com/docs/media-queries.html
//
// Usage:
//
// div {
//  color: blue;
//
// 	@media #{$mobile} {
// 	    color: red;
//   }
//
// }
//

$mobile-small-max-size: 320px !default;
$mobile-max-size: 640px !default;
$tablet-min-size: 768px !default;
$tablet-max-size: 979px !default;
$desktop-min-size: 979px !default;
$desktop-large-min-size: 1200px !default;

$mobile-small: "only screen and (max-width:"#{$mobile-small-max-size }")" !default;
$mobile: "only screen and (max-width:"#{$mobile-max-size }")" !default;
$mobile-portrait: "only screen and (max-width:"#{$mobile-max-size }") and (orientation: portrait)" !default;
$mobile-landscape: "only screen and (max-width:"#{$mobile-max-size }") and (orientation: portrait)" !default;
$mobile-tablet: "only screen and (min-width:"#{$tablet-min-size }")" !default;
$tablet: "only screen and (min-width:"#{$tablet-max-size }")" !default;
$tablet-landscape: "only screen and (max-width:"#{$tablet-max-size }") and (orientation: landscape)" !default;
$tablet-desktop: "only screen and (min-width:"#{$tablet-min-size }")" !default;
$desktop: "only screen and (min-width:"#{$desktop-min-size }")" !default;
$desktop-large: "only screen and (min-width:"#{$desktop-large-min-size }")" !default;
```

What methods do you use?