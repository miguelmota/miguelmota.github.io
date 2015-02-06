//main.js
//
(function (global) {

  "use strict";

  var Moogs = function () {

  };

  Moogs.prototype.initializeGlobal = function () {
    $(document).foundation();

    if ($(window).scrollTop() <= 0) {
      window.scrollTo(0,1);
    }

    FastClick.attach(document.body);

    var
    self = this,
    ajaxed = false;

    if (window.history && window.history.pushState && ajaxed === true) {

      var nav = $('#main-nav'),
      contentHeader = $('#content-header'),
      content = $('#content'),
      body = $('body'),
      main = $('body'),
      href,
      route,
      title,
      contentHeaderDone,
      contentDone,
      state;

      nav.find('a').on('click', function(e) {
        e.preventDefault();

        var _this = $(this);
        href = _this.attr('href');
        route = href.substring(1);
        title = _this.text() + ' » Miguel Mota';

        state = { route: route, path: href };

        document.title = title;

        history.pushState(state, title, href);

        nav.find('li').each(function(i, item) {
          var me = $(this);
          me.removeClass('active');
          _this.closest('li').addClass('active');
        });

        contentHeader.html('');
        content.html('');

        var mainLoader = $('<div class="loader-overlay"><div class="loader"></div></div>');
        main.append(mainLoader);
        window.mainLoader = $('.loader-overlay');

        contentHeader.load(href + ' #content-header > *', function() {
          contentHeaderDone = true;

          if (route == '') {
            route = 'home';
          }

          body.attr('id', route);

          content.load(href + ' #content > *', function() {
            contentDone = true;

            if (route == 'home') {
              self.initializeHome();
            }
            if (route == 'about') {
              self.initializeAbout();
            }
            if (route == 'blog') {
              self.initializeBlog();
            }
            if (route == 'work') {
              self.initializeWork();
            }
            if (route == 'contact') {
              self.initializeContact();
            }

            self.initializeTwitter();

            window.mainLoader.remove();


          });

        });

      });

      $(window).on('popstate', function(e) {
        var state = e.originalEvent.state || history.state,
        route = state.route;

        contentHeader.html('');
        content.html('');

        var mainLoader = $('<div class="loader-overlay"><div class="loader"></div></div>');
        main.append(mainLoader);
        window.mainLoader = $('.loader-overlay');

        var navItem = nav.find('a[href="/'+route+'"]');

        nav.find('li').each(function(i, item) {
          var me = $(this);
          me.removeClass('active');
          navItem.closest('li').addClass('active');
        });

        title = navItem.text() + ' » Miguel Mota';

        state = { route: route };

        document.title = title;

        body.attr('id', route);

        contentHeaderDone = contentDone = false;

        contentHeader.load( '/' +route + ' #content-header > *', function() {
          contentHeaderDone = true;

          content.load( '/' +route + ' #content > *', function() {
            contentDone = true;

            if (route == '') {
              route = 'home';
            }

            body.attr('id', route);

            if (route == 'home') {
              self.initializeHome();
            }
            if (route == 'about') {
              self.initializeAbout();
            }
            if (route == 'blog') {
              self.initializeBlog();
            }
            if (route == 'work') {
              self.initializeWork();
            }
            if (route == 'contact') {
              self.initializeContact();
            }

            self.initializeTwitter();

            window.mainLoader.remove();

          });

        });

      });

    }

  };

  window.appendLoader = function(obj) {
    var loader = $('<div class="loader"></div>');
    obj.append(loader);
    window.loader = $('.loader');
  };

  Moogs.prototype.initializeTwitter = function() {
     twttr.widgets.load();
  };

  Moogs.prototype.initializeHome = function() {
    this.initializeParticles();

    $(document).ready(function() {
      var disqus_shortname = 'miguelmota';
      (function () {
          var s = document.createElement('script'); s.async = true;
          s.type = 'text/javascript';
          s.src = '//' + disqus_shortname + '.disqus.com/count.js';
          (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
      }());
    });
  }

  Moogs.prototype.initializeAbout = function() {
    this.initializeParticles();
  }

  Moogs.prototype.initializeResume = function() {
    this.initializeParticles();

    if (window.location.hash.substr(1) === 'xtopoly-work') {
      var $xtopolyWork = $('#xtopoly-work');
      $xtopolyWork.attr('open', 'open');
      $('html,body').scrollTop($xtopolyWork.offset().top - $('#header').outerHeight(true));
    }

    $(document).on('click', '#xtopoly-work', function() {
      window.location.hash = $(this).attr('id');
    });

    if (!('open' in document.createElement('details'))) {

      $('details').addClass('polyfill');

      $(document).on('click', 'summary', function(e) {
        var $summary = $(this);
        var $details = $summary.parent();

        if ($details.attr('open')) {
          $details.removeAttr('open');
        } else {
          $details.attr('open', 'open');
        }

      });

    }
  }

  Moogs.prototype.initializeBlog = function() {
    this.initializeParticles();

    $(document).ready(function() {
      var disqus_shortname = 'miguelmota';
      (function () {
          var s = document.createElement('script'); s.async = true;
          s.type = 'text/javascript';
          s.src = '//' + disqus_shortname + '.disqus.com/count.js';
          (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
      }());
    });
  }

  Moogs.prototype.initializeWork = function() {
    this.initializeWorkSlider();
    this.initializeParticles();
  };

  Moogs.prototype.initializeContact = function() {
    this.initializeContactMap();
    this.initializeParticles();
  }

  Moogs.prototype.initializeParticles = function() {
    var width,
    height,
    canvas,
    context,
    particleCount = 75,
    gradient,
    particles = [],
    speed = 60;

    var Particle = function() {};

    Particle.prototype.s = {
      ttl:8000,
      xmax:5,
      ymax:2,
      rmax:10,
      rt:1,
      xdef:960,
      ydef:540,
      xdrift:4,
      ydrift: 4,
      random:true,
      blink:true
    };

    Particle.prototype.reset = function() {
      this.x = (this.s.random ? width * Math.random() : this.s.xdef);
      this.y = (this.s.random ? width * Math.random() : this.s.ydef);
      this.r = ((this.s.rmax-1)*Math.random()) + 1;
      this.dx = (Math.random() * this.s.xmax) * (Math.random() < .5 ? -1 : 1);
      this.dy = (Math.random() * this.s.ymax) * (Math.random() < .5 ? -1 : 1);
      this.hl = (this.s.ttl/speed) * (this.r/this.s.rmax);
      this.rt = Math.random()*this.hl;
      this.s.rt = Math.random()+1;
      this.stop = Math.random() * .2 + .4;
      this.s.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
      this.s.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
    }

    Particle.prototype.fade = function() {
      this.rt += this.s.rt;
    }

    Particle.prototype.draw = function() {
      if (this.s.blink && (this.rt <= 0 || this.rt >= this.hl)) this.s.rt = this.s.rt*-1;
      else if (this.rt >= this.hl) this.reset();
      var newo = 1-(this.rt/this.hl);
      context.beginPath();
      context.arc(this.x,this.y,this.r,0,Math.PI * 2,true);
      context.closePath();
      var cr = this.r * newo;
      var colorStop1 = '21,32,40';
      var colorStop2 = '10,43,55';
      var colorStop3 = '23,30,32';
      gradient = context.createRadialGradient(this.x,this.y,0,this.x,this.y,(cr <= 0 ? 1 : cr));
      gradient.addColorStop(0.0, 'rgba('+ colorStop1 +','+newo+')');
      gradient.addColorStop(this.stop, 'rgba('+ colorStop2 +','+(newo*.6)+')');
      gradient.addColorStop(1.0, 'rgba('+ colorStop3 +',0)');
      context.fillStyle = gradient;
      context.fill();
    }

    Particle.prototype.move = function() {
      this.x += (this.rt/this.hl)*this.dx;
      this.y += (this.rt/this.hl)*this.dy;
      if(this.x > width || this.x < 0) this.dx *= -1;
      if(this.y > height || this.y < 0) this.dy *= -1;
    }

    Particle.prototype.getX = function() { return this.x; }
    Particle.prototype.getY = function() { return this.y; }

    width = window.innerWidth;
    height = window.innerHeight;
    canvas = document.getElementById('bg-canvas');
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext('2d');
    for (var i = 0; i < particleCount; i++) {
      particles[i] = new Particle();
      particles[i].reset();
    }

    var draw = function() {
      context.clearRect(0,0,width,height);
      for (var i = 0; i < particles.length; i++) {
        particles[i].fade();
        particles[i].move();
        particles[i].draw();
      }
    }

    var interval = setInterval(draw,speed);

  };

  Moogs.prototype.initializeWorkSlider = function() {
    var Slider = function() {

      this.slider = $('#work-slider');
      this.navPrevSelector = $('#slide-prev');
      this.navNextSelector = $('#slide-next');
      this.navSlideSelector = $('#dots').find('.dot');
      this.autoSlideTimer = 10000;
      this.autoSlideTransTimer = 500;
      this.transitionDuration = 500;
      this.repositionDuration = 800;
      this.transitionsDone = true;
      this.currentSlideNumber = 0;

      var _this = this;

      this.slideContentChange = function(args) {
        if (!args.slideChanged) return false;
        _this.currentSlideNumber = args.currentSlideNumber - 1;
        _this.hideDevices(args);
        _this.updateDots(args);
        _this.updateNavSelector(args);
        _this.transitionDevices(args);
      };

      this.slideContentComplete = function(args) {

      };

      this.slideContentLoaded = function(args) {
        window.loader.remove();
        _this.transitionDevices(args);
        _this.updateDots(args);
        _this.updateNavSelector(args);
      };

      this.updateDots = function(args) {
        _this.slider.find('#dots').find('.dot').removeClass('active');
        _this.slider.find('#dots').find('.dot').eq(this.currentSlideNumber).addClass('active');
      };

      this.updateNavSelector =function(args) {
          if (args.currentSlideNumber == args.data.numberOfSlides) {
             _this.navNextSelector.addClass('disabled');
          } else {
             _this.navNextSelector.removeClass('disabled');
         }

          if (args.currentSlideNumber == 1) {
             _this.navPrevSelector.addClass('disabled');
          } else {
            _this.navPrevSelector.removeClass('disabled');
          }
      };

      this.transitionDevices = function(args) {

        var xDesktop,
        yDesktop,
        xLaptop,
        yLaptop,
        xTablet,
        yTablet,
        xMobile,
        yMobile;

        _this.transitionsDone = false;

        var transitionDesktop = function() {
          _this.slider.find('.slide').eq(_this.currentSlideNumber).find('.desktop').transition({
            opacity: 1,
            duration: _this.transitionDuration,
            easing: 'in',
            translate: [100, 0],
            complete: function() {
              if (!$(this).css('translate')) {
                return false;
              }
              xDesktop = parseInt($(this).css('translate').split(',')[0]);
              yDesktop = parseInt($(this).css('translate').split(',')[1]);
              transitionLaptop();
              return true;
            }
          });
        };

        var transitionLaptop = function() {
          _this.slider.find('.slide').eq(_this.currentSlideNumber).find('.laptop').transition({
            opacity: 1,
            duration: _this.transitionDuration,
            easing: 'in',
            translate: [100,0],
            complete: function() {
              if (!$(this).css('translate')) {
                return false;
              }
              xLaptop = parseInt($(this).css('translate').split(',')[0]);
              yLaptop = parseInt($(this).css('translate').split(',')[1]);
              transitionTablet();
              return true;
            }
          });
        };

        var transitionTablet = function() {
          _this.slider.find('.slide').eq(_this.currentSlideNumber).find('.tablet').transition({
            opacity: 1,
            duration: _this.transitionDuration,
            easing: 'in',
            translate: [-100, 0],
            complete: function() {
              if (!$(this).css('translate')) {
                return false;
              }
              xTablet = parseInt($(this).css('translate').split(',')[0]);
              yTablet = parseInt($(this).css('translate').split(',')[1]);
              transitionMobile();
              return true;
            }
          });
        };

        var transitionMobile = function() {
          _this.slider.find('.slide').eq(_this.currentSlideNumber).find('.mobile').transition({
            opacity: 1,
            duration: _this.transitionDuration,
            easing: 'in',
            translate: [-100,0],
            complete: function() {
              if (!$(this).css('translate')) {
                return false;
              }
              xMobile = parseInt($(this).css('translate').split(',')[0]);
              yMobile = parseInt($(this).css('translate').split(',')[1]);
              repositionDevices();
              return true;
            }
          });
        };

        var repositionDevices = function () {

          _this.slider.find('.slide').eq(_this.currentSlideNumber).find('.desktop').transition({
            translate: [xDesktop, yDesktop - 10],
            duration: _this.repositionDuration,
            easing: 'in',
            complete: function() {}
          });

          _this.slider.find('.slide').eq(_this.currentSlideNumber).find('.laptop').transition({
            translate: [xLaptop, yLaptop + 10],
            duration: _this.repositionDuration,
            easing: 'in',
            complete: function() {}
          });

          _this.slider.find('.slide').eq(_this.currentSlideNumber).find('.tablet').transition({
            translate: [xTablet, yTablet - 5],
            duration: _this.repositionDuration,
            easing: 'in',
            complete: function() {}
          });

          _this.slider.find('.slide').eq(_this.currentSlideNumber).find('.mobile').transition({
            translate: [xMobile, yMobile + 5],
            duration: Slider.prototype.repositionDuration,
            easing: 'in',
            complete: function() {
              transitionCaption();
              return true;
            }
          });

        }

        var transitionCaption = function() {
          _this.slider.find('.slide').eq(_this.currentSlideNumber).find('.caption').transition({
            opacity: 1,
            duration: _this.transitionDuration,
            easing: 'in',
            translate: [0, 10],
            complete: function() {
              _this.transitionsDone = true;
              return true;
            }
          });
          _this.slider.find('.slide').eq(_this.currentSlideNumber).find('.site').transition({
            opacity: 1,
            duration: _this.transitionDuration,
            easing: 'in',
            complete: function() {
            }
          });
        }

        transitionDesktop();

      };

      this.hideDevices = function() {
        _this.slider.find('img, .caption, .site').css({ opacity: 0, '-moz-transform': '', '-webkit-transform': '', 'transform': '' }).end()
        .find('.desktop').css({ left: -100, bottom: -10 }).end()
        .find('.laptop').css({ left: -100, bottom: -5 }).end()
        .find('.tablet').css({ right: -100, bottom: -10 }).end()
        .find('.mobile').css({ right: -100, bottom: -10 }).end()
        .find('.caption').css({ left: 0, top: -10 }).end();
      };

      this.initialize = function() {

        _this.slider.iosSlider({
          scrollbar: false,
          snapToChildren: true,
          desktopClickDrag: true,
          responsiveSlideWidth: true,
          responsiveSlides: true,
          navPrevSelector: _this.navPrevSelector,
          navNextSelector: _this.navNextSelector,
          navSlideSelector: _this.navSlideSelector,
          infiniteSlider: false,
          autoSlide: true,
          autoSlideTimer: _this.autoSlideTimer,
          autoSlideTransTimer: _this.autoSlideTransTimer,
          onSlideChange: _this.slideContentChange,
          onSlideComplete: _this.slideContentComplete,
          onSliderLoaded: _this.slideContentLoaded
        });

      };

      window.appendLoader(_this.slider);
      _this.hideDevices();

    }

    var slider = new Slider();
    var scrollTop = $('#content-header').offset().top;
    if ($(window).scrollTop() >= scrollTop) {
      slider.initialize();
      $(window).unbind('scroll');
    }
    $(window).on('scroll', function() {
      if ($(window).scrollTop() >= scrollTop) {
        slider.initialize();
        $(window).unbind('scroll');
      }
    });
  };

  Moogs.prototype.initializeContactMap = function() {
    var initializeMap = function() {
      var map,
          marker,
          latlng,
          mapOptions,
          mapStyles,
          markerImage,
          markerShadow,
          infoWindow,
          infoWindowContent;

            var losAngeles = '34.0452,-118.284',
                riverside = '33.7643995,-116.7037845,9',
                orangeCounty = '33.6670191,-117.7646826';
      latlng = new google.maps.LatLng(orangeCounty.split(',')[0], orangeCounty.split(',')[1]);

      mapOptions = {
        zoom: 5,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        animation: google.maps.Animation.DROP,
        scrollwheel: false,
        disableDefaultUI: true
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      mapStyles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];

      map.setOptions({
        styles: mapStyles
      });

      markerImage = new google.maps.MarkerImage("/assets/images/map-marker.png");

      markerShadow = new google.maps.MarkerImage(
        "/assets/images/map-marker-shadow.png",
        new google.maps.Size(52,34),
        new google.maps.Point(0,0),
        new google.maps.Point(10,30)
      );

      marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: "",
        shadow: markerShadow,
        icon: markerImage
      });

      infoWindowContent = $('#contact-map-content').html();

      infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });

      infoWindow = new InfoBox({
             content: infoWindowContent,
             disableAutoPan: false,
             maxWidth: 200,
             pixelOffset: new google.maps.Size(-100, 0),
             zIndex: null,
             position: new google.maps.LatLng(34.0452,-118.284),
             boxStyle: {
                 background: "url('/assets/images/map-tipbox-top.gif') no-repeat",
                 opacity: 0.75,
                 width: "200px"
            },
            closeBoxMargin: "12px 2px 4px 2px",
            closeBoxURL: "/assets/images/map-close-icon.png",
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            alignBottom: false,
            pane: "floatPane"
      });

      infoWindow.open(map, marker);

      var reposition = function () {
        map.setCenter(latlng);
        map.setZoom(10);
        infoWindow.open(map, marker);
      };

      google.maps.event.addListener(marker, 'click', function() {
        reposition();
      });

      $(document).on('click', '[data-location]', function() {
        reposition();
      });

    };

    initializeMap();

    $(document).on('submit', '#contact-form', function(e) {
      e.preventDefault();

      var me = $(this),
          str = me.serialize();

      me.find('input.error, textarea.error').removeClass('error');
      me.find('small.error').css({'display':'none'});

      me.find('[data-alert]').css({'display':'none'});

      $.ajax({
        url: me.attr('action'),
        type: 'POST',
        dataType: 'json',
        data: str,
        complete: function(xhr, textStatus) {
        },
        success: function(data, textStatus, xhr) {

           _gaq.push(['_trackEvent', 'Forms', 'Submission', 'Contact']);

          if (data.status_code) {
            var statusCode = parseInt(data['status_code']);
          }

          if (statusCode == 500) {
            if (data.error) {
              var errorMessage = data.error;
              me.find('[data-alert] .message').html(errorMessage);
              me.find('[data-alert]').addClass('alert').css({'display':'block'});
            }
          }

          if (statusCode == 400) {
            if (data.errors) {
              var errors = data.errors
              for (var errorField in errors) {
                me.find('[name="'+errorField+'"]').addClass('error');
                me.find('small.error[for="'+errorField+'"]').html(errors[errorField]).css({'display':'block'});
              }
              me.find('input.error, textarea.error').eq(0).focus();
            }
          }

          if (statusCode == 200) {
            if (data.message) {
              var successMessage = data.message;
             }
            me.find('[data-alert] .message').html(successMessage);
            me.find('[data-alert]').removeClass('alert').addClass('success').css({'display':'block'});
            me.find('input[type="text"], input[type="email"], textarea').val('');
          }
        },
        error: function(xhr, textStatus, errorThrown) {
          me.find('[data-alert] .message').html('Sorry, an error occured.');
          me.find('[data-alert]').addClass('alert').css({'display':'block'});
        }
      });
    });
  };

  var moogs = new Moogs();

  $(document).on('click', '.input-short-url input', function() {
    $(this).select();
  });

  $(document).ready(function() {
    var page;

    moogs.initializeGlobal();

    page = $('body').attr('id');
    switch(page) {
      case 'home':
        moogs.initializeHome();
        break;
      case 'about':
        moogs.initializeAbout();
        break;
      case 'resume':
        moogs.initializeResume();
        break;
      case 'blog':
      case 'archive':
        moogs.initializeBlog();
        break;
      case 'work':
        moogs.initializeWork();
        break;
      case 'contact':
        moogs.initializeContact();
        break;
      default:
        break;
    }

  });

  global.moogs = moogs;

})(this);
