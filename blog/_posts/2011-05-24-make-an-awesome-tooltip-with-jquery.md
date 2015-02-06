---
layout: blog-post
title: Make an Awesome Tooltip with jQuery
category: blog
tags: [JavaScript, jQuery, demo]
description: Tutorial on how to make an simple yet awesome animated tooltip using jQuery.
---
I will attempt to show you how to make a simple yet awesome tooltip using jQuery and CSS3.

Ok so first let's set up the HTML:

```html
<a class="awesometooltip" href="http://www.miguelmota.com" title="Hello, I am a tootip!">hover over me</a>
```

All we did was make a link with the class of `awesometooltip` (that's what I decided to call this mini plugin) and gave it a `title` attribute.

Now let's move on to the fun stuff. We are going to make a self executing function so that the plugin won't collide with other libraries that use the `$` dollar sign:

```javascript
(function($) {

})(jQuery);
```

Inside this function we are going to add a new function property to the `jQuery.fn` object where the name of the property is the name of the plugin:

```javascript
(function($) {
  $.fn.awesometooltip = function() {
    //plugin code
  }
})(jQuery);
```

Ok now we want to rename the `title` to something else, in this case I renamed it to `awesometooltip`. How we are going to do this is by making a new attribute and copying the contents of the `title`
attribute and then removing the `title` attribute. So what's the point in doing this? if we don't, we will have our custom tooltip and the default tooltip pop up at the same time.. which will be a nuisance!

```javascript
$(this).attr("awesometooltip",$(this).attr("title")).removeAttr("title");
```

So now let's assign the `awesometooltip` attribute to a variable named `title`:

```javascript
var title = $(this).attr("awesometooltip");
```

Next we want to wrap the link in a container:

```javascript
$(this).wrap('<div class="tooltip-container" />');
```

We don't want the words in the link to break so we'll keep them in the same line:
```javascript
$(this).css("white-space","nowrap");
```

Let's prepend a new element with a class of `tooltip` inside the `tooltip-container` div:

```javascript
$("div.tooltip-container").prepend('<div class="tooltip" />');
```

Let's create the functions for the hover method:

```javascript
$(this).hover(function() {
    //hover over do stuff
  }, function() {
    //hover out do stuff
});
```

Inside the first hover function we are going to insert the content from `title` variable in to the previous element which is the `tooltip` div and animate the tooltip:

```javascript
$(this).prev().text(title).stop(true,true).animate({opacity: "show", top: "-30"}, "slow");
```

Now make it fade out on hover out:

```javascript
jQuery(this).next('div.tooltip').animate({opacity: "hide", top: "-20"}, "fast");
```

So the whole jQuery plugin code should look something like this:

```javascript
(function($) {
  $.fn.awesometooltip = function() {
    $(this).each(function(){
      $(this).attr("awesometooltip",$(this).attr("title")).removeAttr("title");
      var title = $(this).attr("awesometooltip");
      $(this).wrap('<div class="tooltip-container" />');
      $(this).css("white-space","nowrap");
      $("div.tooltip-container").prepend('<div class="tooltip" />');
      $(this).hover(function() {
          $(this).prev().text(title).stop(true,true).animate({opacity: "show", top: "-30"}, "slow");
        }, function() {
          $(this).prev().animate({opacity: "hide", top: "-20"}, "fast");
      });
    });
  }
})(jQuery);
```

It's time to style the tooltip:

```css
.tooltip-container {
  display: inline-block;
  position: relative;
  z-index: 1000;
}

.tooltip  {
  background-color: #000;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  box-shadow: 1px 1px 3px #000;
  -moz-box-shadow: 1px 1px 3px #000;
  -webkit-box-shadow: 1px 1px 3px #000;
  color: #fff;
  display: none;
  font-family: Arial, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: normal;
  opacity: .8;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
  filter: alpha(opacity=80);
  padding: 5px 10px;
  position: absolute;
  text-align: center;
  top: -20px;
  white-space: nowrap;
  z-index: 1000;
}

/* triangle on the bottom */
.tooltip:after {
  border-color: #000 transparent;
  border-style: solid;
  border-width: 5px 5px 0; /* vary these values to change the angle of the vertex */
  bottom: -5px; /* value = - border-top-width - border-bottom-width */
  content: "";
  display: block;
  height: 0;
  left: 10px; /* controls horizontal position */
  margin-left: -5px;
  position: absolute;
  width: 0;
  z-index: 1000;
}
```

The CSS is self-explanatory so I won't go in much detail

So the last step now is to initialize our tooltip:

```javascript
$(document).ready(function(){
  $('.awesometooltip').awesometooltip();
});
```

But wait.. since Internet Explorer doesn't support `border-raidus` we have to use a script to render it. I will use [CSS3 PIE](http://css3pie.com/). Simply add the `behavior`
rule at the end of the `tooltip` class, but make sure the path is relative to the HTML file being viewed, so for example if you upload the `PIE` folder to the root of your site;
it should look like this:

```css
.tooltip  {
  ...
  behavior: url('/PIE/PIE.htc');
}
```

That's it folks! You should now have a functioning mini tooltip plugin. If I made mistakes or if you would like to add, please comment! any feedback is greatly appreciated.

[View the demo »]({{ page.url }}/demo)

---

## <strong>*Update</strong> <small>25 May 2012</small>

I created optional settings for the tooltip. Here is the <a href="https://gist.github.com/miguelmota/5312164" target="_blank">gist</a>:

```javascript
(function($) {

  var methods = {
    init: function(options) {

      var settings = {
        backgroundColor: '#000',
        borderColor: '#000',
        borderRadius: '.5em',
        boxShadow: '.1em .1em .5em #000',
        color: '#fff',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: 'normal',
        opacity: 1,
        padding: '.8em 1.2em',
        positionLeft: '50%',
        positionTop: '-2.5em',
        textShadow: '0 -1px 0 rgba(0,0,0,.8)',
        showSpeed: 400,
        hideSpeed: 200,
        timeout: 600
      };

      options = $.extend(settings, options);

      return this.each(function() {

        var elem = $(this);

        if(!elem.attr('title')) return true;

        elem.append($('<span class="mtippy">' + elem.attr('title') +
              '<span class="mtippy-tip-shadow"></span><span class="mtippy-tip"></span></span>')).addClass('mtippy-wrap');

        var t;

        elem.hover(function() {

          $('.mtippy', elem).css('margin-left', -$('.mtippy', elem).outerWidth()/2).stop(true,true).animate({opacity: 'show', top: '-3em'}, settings.showSpeed);

          clearTimeout(t);

        }, function() {

          t = setTimeout(function() {

            $('.mtippy', elem).animate({opacity: 'hide', top: '-2.5em'}, settings.hideSpeed);

          }, settings.timeout);

        });

        elem.removeAttr('title');

        /*
         * css styles
         */

        $('.mtippy-wrap').css({
          'position': 'relative',
          'text-decoration': 'none'
        });

        $('.mtippy', this).css({
          'background': settings.backgroundColor,
          'border': '1px solid ' + settings.backgroundColor,
          'border-radius': settings.borderRadius,
          '-moz-border-radius': settings.borderRadius,
          '-webkit-border-radius': settings.borderRadius,
          'box-shadow': settings.boxShadow,
          '-moz-box-shadow': settings.boxShadow,
          '-webkit-box-shadow': settings.boxShadow,
          'color': settings.color,
          'display': 'none',
          'font-family': settings.fontFamily,
          'font-size': settings.fontSize,
          'font-style': settings.fontStyle,
          'font-weight': settings.fontWeight,
          'left': settings.positionLeft,
          'line-height': '1',

          'opacity': settings.opacity + ' !important',
          /* IE opacity
          '-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha(Opacity='+settings.opacity * 10+')"',
          'filter': 'alpha(opacity='+settings.opacity * 10+')',
          */
          'padding': settings.padding,
          'position': 'absolute',
          'text-align': 'center',
          'text-decoration': 'none',
          'text-shadow': settings.textShadow,
          'top': settings.positionTop,
          'white-space': 'nowrap'
        });

        $('.mtippy-tip, .mtippy-tip-shadow', this).css({
          'border': '.5em solid transparent',
          'border-top-color': settings.backgroundColor,
          'bottom': '-1em',
          'height': '0',
          'left': settings.positionLeft,
          'margin-left': '-.5em',
          'position': 'absolute',
          'width': '0'
        });

      });

    },
    show: function() {
      $(this).trigger('mouseenter');
    },
    hide: function() {
      $(this).trigger('mouseleave');
    }

  };

  $.fn.mtippy = function(method) {

      // Method calling logic
      if ( methods[method] ) {
        return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
      } else if ( typeof method === 'object' || ! method ) {
        return methods.init.apply( this, arguments );
      } else {
        $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
      }

  }

})(jQuery);
```

Usage:

In the head section:

Include jQuery:

```html
<script src="http://code.jquery.com/jquery.min.js"></script>
```

Include mtippy:

```html
<script src="/js/jquery.mtippy.js"></script>
```

Initialize mtippy:

```javascript
$(document).ready(function() {
    $('[title]').mtippy();
});
```

Customize settings (optional):

```javascript
$('[title]').mtippy({

    /* default settings */

    backgroundColor: '#000',
    borderRadius: '.5em',
    boxShadow: '.1em .1em .5em #000',
    color: '#fff',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    opacity: 1,
    textShadow: '0 -1px 0 rgba(0,0,0,.8)',
    showSpeed: 400,
    hideSpeed: 200,
    timeout: 600

});
```

<a data-demo href="{{ page.url }}/mtippy/demo" target="_blank">View Updated Demo</a>
