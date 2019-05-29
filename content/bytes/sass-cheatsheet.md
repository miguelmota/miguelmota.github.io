---
layout: byte
title: Sass Cheatsheet
type: bytes
tag: [Sass, CSS]
description: A cheatsheet for Sass.
date: 2014-10-01T00:00:00-00:00
draft: false
---
A [Sass](http://sass-lang.com/) cheatsheet.

### Watching

```bash
sass --watch sass:css
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#using_sass)

### Comments

```css
// I will not show when compiled

/* I will be shown when compiled */
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#comments)

### Imports

```css
@import 'foo';
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#import)

### Variables

```css
$foo: #000 !default;
$bar: baz qux quux corge;
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variables_)

### Nesting

Selector nesting

```css
.foo  {
  .bar {
    // .foo .bar { }
  }
}
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#nested_rules)

Property nesting

```css
.foo {
  text: {
    align: center; // .foo { text-align: center; }
  }
}
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#nested_properties)

### Parent Selectors

```css
a {
  &:hover {
    // a:hover { }
  }
}
```

```css
.bar {
 .foo & {
   // .foo .bar { }
  }
}
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#referencing_parent_selectors_)

### Interpolation

```css
$foo: bar;

.baz-#{$foo} {
  // .baz-bar { }
}
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#interpolation_)


### Concatenation

```css
$foo: 'serif';

.bar {
	$font: 'sans-' + $foo; // 'sans-serif'
}
```

### Mixins

```css
@mixin foo($bar, $baz: false) {
  color: $bar;
  @if baz {
    border-radius: $baz;
  }
}

.qux {
  @include foo(#000, 10px);
}
```

Variable arguments

```css
@mixin bar($baz...) {
  box-shadow: $baz
}

.qux {
  $baz: 0px 4px 5px #666, 2px 6px 10px #999;
  @include bar($baz);
}
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#defining_a_mixin)

### Extend

```css
%foo {
 color: #000;
}

.bar {
  background: #fff;
}

.baz {
  @extend %foo; // color: #000
  @extend %qux !optional; // fail silenty if not found
  @extend .bar; // background: #fff
}
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#extend)


### Control directives

#### if, if else, else

```css
$foo: bar;

.qux {
  @if $foo == bar {
     color: #000;
  } @else if $foo == baz {
    color: #fff;
   } @else {
     color: #999;
   }
}

.qux {
	color: if($foo == bar, #000, #999); // if([condition], [if true], [else])
}
```

```
$foo: "foo";
$bar: "bar";
$qux: "qux";

@if ($foo == "foo" and not ($bar == "bar")) or ($qux == "qux") {
  // second condition is true
}
```

#### each

```css
$foo: bar baz qux;

@each $f in $foo {
	.quux-#{$f} {
		background: url(quux-#{$f}.png); // .quux-bar { background: url(quux-bar.png) }
	}
}
```

#### for

```css
.qux {
	@for $i from 1 through 5 {
		&.qux-#{$i} {
			// .qux.qux-1 { }
		}
	}
}
```

#### while

```css
$i: 1;

.qux {
	@while $i <= 5 {
		&.qux-#{$i} {
			// .qux.qux-1 { }
		}

		$i: $i + 1;
	}
}
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#control_directives)


### Function directives

```css
@function foo($bar, $baz) {
	@return ($bar / $baz);
}

.qux {
	width: foo(10px, 2px); // 5px
}
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#functions)

### List functions

```css
$foo: bar baz qux quux;
$grault: garphly, waldo, fred, plugh;

length($foo); // 4 (index starts at 1)
append($foo, corge); // bar baz qux quux corge (does not alter original)
join($foo, $grault); // bar baz qux quux garphly, waldo, fred, plugh
index($foo, baz); // 2
nth($foo, 2); // baz
zip($foo, $grault); // [bar garphly] [baz waldo] [qux fred] [quux plugh]
```

`zip()` example

```css
$users: foo bar;
$colors: blue green;
$style: zip($names, $colors); // [foo blue] [bar green]
@each $u in $style {
  .users-#{nth($u, 1)} {      // .users-foo { }
    background: nth($u, 2);   // background: blue;
  }
 }
```

### Color functions

```css
$foo: #ff0000;

rgba($foo, 0.8); // rgba(0, 255, 0, 0.8)
lighten($foo, 20%); // #66ff66
darken($foo, 20%); // #009900
saturate($foo, 20%); // lime
desaturate($foo, 20%); // #19e619
mix(#ff0000, #0000ff); // #7f007f
mix(#ffff00, #0000ff, 20%); // #3300cc (3rd parameter is percentage of first color)
grayscale($foo); // grey
invert($foo); // magenta
complement($foo); // magenta
scale_color($foo, $lightness: 20%); // #33ff33
scale_color($foo, [$red], [$green], [$blue], [$saturation], [$lightness], [$alpha]); // changes color aspect(s) relative, rather than linearly, to the start value
```

[source](http://sass-lang.com/documentation/Sass/Script/Functions.html#rgb_functions)

### Number functions

```css
$foo: 1.4;
$bar: 1.3 4.5 -2.8;

round($foo;) // 1
ceil($foo); // 2
floor($foo); // 1
abs($foo); // 1.4
percentage($foo) // 140%
min($bar...) // -2.8
max($bar...) // 4.5
```

[source](http://sass-lang.com/documentation/Sass/Script/Functions.html#number_functions)

### Media queries

```css
.foo {
	@media (min-width: 768px) {
	  // @media (min-width: 768px) { .foo { } }
	}
}
```

Using a mixin

```css
@mixin respond-to($media) {
	@if $media == desktop {
		@media (min-width: 960px) {
			@content;
    	}
    } @else if $media == tablet {
    	@media (min-width: 768px) {
      		@content;
    	}
  	}
}

.foo {
	@inclue respond-to(tablet) {
		// @media (min-width: 768px) { .foo { } }
	}
}
```

[source](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#media)

#### Some helpful resources

- [Sass reference](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)
- [The Sass Way](http://thesassway.com/)
- [Sasmeister](http://sassmeister.com/)
- [Scalable and Modular Architecture for CSS](http://smacss.com/)


On github at [miguelmota/sass-cheatsheet](https://github.com/miguelmota/sass-cheatsheet).
