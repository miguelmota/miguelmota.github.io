---
layout: blog-post
title: Slide Out Navigation using CSS3 Translate
category: blog
tags: [CSS3, transform, translate, navigation, demo]
description: Facebook style slide out navigation using CSS3 Translate for the animation.
---
There are many ways to create a navigation menu for a mobile site, but the kind that seems to be most popular at the time is a slide out menu, such as the one you see on the Facebook app. The advantages of using this type of menu is that it is easily accessible and there is a lot of room for list items since the user can scroll within the menu.

I will go through the process of a creating a barebones slide out menu. But with a little bit of styling you can make look somewhat decent like this:


	<figure style="width:49%;float:left;">
		<a href="{{ page.url }}/demo" target="_blank"><img src="{{ page.url }}/slide-out-navigation-closed.png" alt=""></a>
		<figcaption>Navigation closed</figcaption>
	</figure>
	<figure style="width:49%;float:right;">
		<a href="{{ page.url }}/demo" target="_blank"><img src="{{ page.url }}/slide-out-navigation-opened.png" alt="" ></a>
		<figcaption>Navigation opened</figcaption>
	</figure>


[View the complete demo »]({{ page.url }}/demo)

Alright let's get started.

## HTML

```css
<input type="checkbox" id="nav-handler">

<nav id="nav">
	<ul>
		<li><a href="#">Nav Item 1</a></li>
		<li><a href="#">Nav Item 2</a></li>
		<li><a href="#">Nav Item 3</a></li>
	</ul>
</nav>

<main id="main-container">

	<header id="header">
		<label id="menu-button" for="nav-handler">Menu</label>
	</header>

	<section id="content-container">
		<article id="content">
			This is a barebones slide out navigation demo.
		</article>
	</section>

</main>
```

So we first set a `checkbox` with an `id` at the top of the document. I will explain why later. After it we have our `nav` element. This is the menu that will slide out.

After the nav we have a `main` container. When the menu is opened this container will be partially sliding over off screen.

Inside the main container we have a `header`. Notice that inside the header there is a label acting as the menu button. **Very important** to set the `for` attribute to the `id` of the checkbox. When the label is pressed, it will change the state of the checkbox. It's essentially acting as a *toggle*. The checkbox with will either be checked or unchecked; if it's checked the navigation opens, it it's unchecked the navigation closes. Make sense?

And finally after the header we have a `section` element that holds the content.

## CSS

```css
/* Global styles */
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
}
html, body {
	height: 100%;
}
body {
	position: relative;
	overflow: hidden;
	font-size: 16px;
	font-family: sans-serif;
}

/* Hide nav handler checkbox */
#nav-handler {
	display: none;
}

/* Header */
#header {
	position: static;
	top: 0;
	left: 0;
	width: 100%;
	height: 75px;
	z-index: 2;
	background: #999;
}

/* Header menu button */
#menu-button {
	display: inline-block;
	float: left;
	line-height: 4.5;
	cursor: pointer;
}

/* Header active menu button */
#nav-handler:checked ~ #menu-button {
	color: #08c;
}

/* Slide out navigation */
#nav {
	position: fixed;
	top: 0;
	left: 0;
	width: 80%;
	height: 100%;
	z-index: 1;
	overflow: auto;
	-webkit-overflow-scrolling: touch;
	transition: opacity 0s .25s;
	-moz-transition: opacity 0s .25s;
	-webkit-transition: opacity 0s .25s;
	background: #bbb;
}

/* Active slide out navigation */
#nav-handler:checked ~ #nav {
	opacity: 1;
	transition: opacity 0s 0s;
	-moz-transition: opacity 0s 0s;
	-webkit-transition: opacity 0s 0s;
}

/* Slide out navigation list items */
#nav ul li {
	display: block;
	clear: both;
}

#nav ul li a {
	display: block;
	width: 100%;
	height: 100%;
}

#main-container {
	display: block;
	position: relative;
	height: 100%;
	transform: translate3D(0,0,0);
	-moz-transform: translate3D(0,0,0);
	-webkit-transform: translate3D(0,0,0);
	transition: -moz-transform .25s ease-in-out;
	-moz-transition: -moz-transform .25s ease-in-out;
	-webkit-transition: -webkit-transform .25s ease-in-out;
	z-index: 5;
}

/* Translate main container when nav handler is checked */
#nav-handler:checked ~ #main-container {
	transform: translate3D(80%,0,0); /* X value must be same as Nav width */
	-moz-transform: translate3D(80%,0,0); /* X value must be same as Nav width */
	-webkit-transform: translate3D(80%,0,0); /* X value must be same as Nav width */
}

#content-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	padding: 75px 0 0 0; /* Top padding must be same as header height */
	overflow-y: scroll;
	-webkit-overflow-scrolling: touch;
	background: #fff;
	z-index: -1;
}
```

Running down through the CSS; at the top we have global styles. We set the height to 100% on the html and body elements, and set `overflow` to hidden on the body element.

We obviously do not want to display the checkbox so we hide it.

Afterwards we have styling for the header and menu button.

Then we get to the nav. We need to have it positioned `fixed` and have `-webkit-overflow-scrolling: touch` in order to have *smooth*, elastic scrolling.

For the `main` container we must set the z-index to higher number than the nav because it sits on top of it. When the user taps the menu button, the main container will slide over to the right using CSS3 `translate3D` and `transition` for the animation. When it slides, over the navigation menu below it will be revealed. So when the checkbox is checked, we set `translate3D(80%,0,0)` on the main container which will move it over to the right by 80%. This is *pretty much* the **magic** of this whole tutorial.

You might be wondering what the `~` (tilde) does. In CSS the `~` selector is the *general sibling combinator*, which means that it will match elements that come ***after*** it; *not a child*. So in our example, `#nav-handler:checked ~ #main-container` is a selector for the main container when the checkbox is checked.

[View the barebones demo »]({{ page.url }}/barebones-demo)

Here's the [gist](https://gist.github.com/miguelmota/5737739).

## Android Support

Unfortunately, this will not work on some Android browsers because clicking on the `label` will not trigger the checkbox to become checked, nor does the general sibling combinator selector work. So we have to resort to a bit of JavaScript. First we need to add a class, `.nav-handler-checked`, in our css:

```css
#nav-handler:checked ~ #main-container,
.nav-handler-checked {
	transform: translate3D(80%,0,0);
	-moz-transform: translate3D(80%,0,0);
	-webkit-transform: translate3D(80%,0,0);
}
```

Then when the nav handler label is clicked we add the *nav-handler-checked* class to the main container. If the main container already contains the class, we simply remove it. I'll be using jQuery for the sake of simplicity.

```javascript
/* Android support */
if (/Android/i.test(navigator.userAgent)) {
	$('#nav-handler').on('click', function(e){
		e.preventDefault();
		var $mainContainer = $('#main-container');
		if ($mainContainer.hasClass('nav-handler-checked')) {
			$mainContainer.removeClass('nav-handler-checked');
		} else {
			$mainContainer.addClass('nav-handler-checked');
		}
	});
}
```

## Conclusion

I Hope this was helpful. Nothing is perfect and there is *always* room for improvement. Perhaps leave some feedback, as all feedback is greatly appreciated.
