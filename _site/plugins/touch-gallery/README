NETEYE Touch-Gallery
====================

A fullscreen photo gallery for touch-devices.

Supported Browsers
------------------

The plugin was written and optimized for Mobile Safari running on the iPad or iPhone 4.
It also runs in Dektop Safari, Firefox 4, as well as in Opera and Chrome.

The gallery is also viewable in older Firefox versions and Internet Explorer, but the 
transition effects are missing.

Dependencies
------------

NETEYE Touch Gallery depends on two other plugins that are also part of the NETEYE Plugin 
Collection: [transform](/transform.html) and [activity-indicator](/activity-indicator.html).
When you download this plugin as distribution archive, you get an all-in-one JavaScript file
that contains all required files.

The plugin requires jQuery v1.4.2 (or higher).

Usage
-----

<div class="liquid highlight html"></div>

    <div id="gallery">
      <a href="image1.jpg">
        <img src="thumb1.jpg" />
      </a>
      <a href="image2.jpg">
        <img src="thumb2.jpg" />
      </a>
      <a href="image3.jpg">
        <img src="thumb3.jpg" />
      </a>
    </div>
	
    <script>
      $('#gallery a').touchGallery();
    </script>

<div class="liquid endhighlight"></div>
	
By default the plugin uses the `href` attribute of the matched elements to obtain the URL of the
large-scale images. You may change this behaviour by providing a `getSource` function:

<div class="liquid highlight html+javascript"></div>

    <img src="thumb1.jpg" data-large="image1.jpg" />
    <img src="thumb2.jpg" data-large="image2.jpg" />
    <img src="thumb3.jpg"  data-large="image3.jpg" />
    
    <script>
      $('img[data-large]').touchGallery({
        getSource: function() { 
          return $(this).attr('data-large');
        }
      });
    </script>

<div class="liquid endhighlight"></div>
  
Links
-----

* Author:  [Felix Gnass](http://github.com/fgnass)
* Company: [NETEYE](http://neteye.de)
* License: [MIT](http://neteye.github.com/MIT-LICENSE.txt)
* Demo:    http://neteye.github.com/touch-gallery.html

Please use the [GitHub issue tracker]{http://github.com/neteye/jquery-plugins/issues} for bug
reports and feature requests.

