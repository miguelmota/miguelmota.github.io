(function (global) {
  'use strict';

  var Moogs = function () {};

  Moogs.prototype.initializeGlobal = function () {
    FastClick.attach(document.body);

   $(document).on('click', '[data-ga-label]', function() {
     if (window._gaq) {
      _gaq.push(['_trackEvent', 'Call To Action', 'Click', $(this).attr('data-ga-label')]);
     }
    });
  };

  Moogs.prototype.initializeHome = function() {
    $(document).ready(function() {
      var disqus_shortname = 'miguelmota';
      (function () {
          var s = document.createElement('script'); s.async = true;
          s.type = 'text/javascript';
          s.src = '//' + disqus_shortname + '.disqus.com/count.js';
          (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
      }());
    });
  };

  Moogs.prototype.initializeAbout = function() {

  };

  Moogs.prototype.initializeResume = function() {
    if (window.location.hash.substr(1) === 'xtopoly-work') {
      var $xtopolyWork = $('#xtopoly-work');
      $xtopolyWork.attr('open', 'open');
      $('html,body').scrollTop($xtopolyWork.offset().top - $('.header').outerHeight(true));
    }

    $(document).on('click', '#xtopoly-work', function() {
      window.location.hash = $(this).attr('id');
    });

    if (!('open' in document.createElement('details'))) {

      $('details').addClass('polyfill');

      $(document).on('click', 'summary', function(e) {
        var $summary = $(this),
            $details = $summary.parent();

        if ($details.attr('open')) {
          $details.removeAttr('open');
        } else {
          $details.attr('open', 'open');
        }

      });

    }
  };

  Moogs.prototype.initializeBlog = function() {
    $(document).ready(function() {
      var disqus_shortname = 'miguelmota';
      (function () {
          var s = document.createElement('script'); s.async = true;
          s.type = 'text/javascript';
          s.src = '//' + disqus_shortname + '.disqus.com/count.js';
          (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
      }());
    });
  };

  Moogs.prototype.initializeWork = function() {

  };

  Moogs.prototype.initializeContact = function() {
    this.initializeContactMap();
  };

  Moogs.prototype.initializeContactMap = function() {
    function initializeMap() {
      var map,
          marker,
          latlng,
          mapOptions,
          mapStyles,
          markerImage,
          markerShadow,
          infoWindow,
          infoWindowContent,
          coords = {
            losAngeles: [34.0452, -118.284],
            riverside: [33.7643995, -116.7037845,9],
            orangeCounty: [33.6670191, -117.7646826],
            veniceBeach: [33.988973, -118.462617]
           };

      latlng = new google.maps.LatLng(coords.veniceBeach[0], coords.veniceBeach[1]);

      mapOptions = {
        zoom: 5,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        animation: google.maps.Animation.DROP,
        scrollwheel: false,
        disableDefaultUI: true
      };

      map = new google.maps.Map(document.querySelector('.map'), mapOptions);

      mapStyles = [{'featureType':'all','elementType':'labels.text.fill','stylers':[{'color':'#ffffff'}]},{'featureType':'all','elementType':'labels.text.stroke','stylers':[{'color':'#000000'},{'lightness':13}]},{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'administrative','elementType':'geometry.stroke','stylers':[{'color':'#144b53'},{'lightness':14},{'weight':1.4}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#08304b'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#0c4152'},{'lightness':5}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#0b434f'},{'lightness':25}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'color':'#0b3d51'},{'lightness':16}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#000000'}]},{'featureType':'transit','elementType':'all','stylers':[{'color':'#146474'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#021019'}]}]

      map.setOptions({
        styles: mapStyles
      });

      markerImage = new google.maps.MarkerImage('/assets/images/map-marker.png');

      markerShadow = new google.maps.MarkerImage(
        '/assets/images/map-marker-shadow.png',
        new google.maps.Size(52,34),
        new google.maps.Point(0,0),
        new google.maps.Point(10,30)
      );

      marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: '',
        shadow: markerShadow,
        icon: markerImage
      });

      infoWindowContent = $('.contact-map-content').html();

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
                 background: 'url("/assets/images/map-tipbox-top.gif") no-repeat',
                 opacity: 0.75,
                 width: '200px'
            },
            closeBoxMargin: '12px 2px 4px 2px',
            closeBoxURL: '/assets/images/map-close-icon.png',
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            alignBottom: false,
            pane: 'floatPane'
      });

      infoWindow.open(map, marker);

      var reposition = function () {
        map.setCenter(latlng);
        map.setZoom(10);
        infoWindow.open(map, marker);
      };

      google.maps.event.addListener(marker, 'click', reposition);

      $(document).on('click', '[data-location]', reposition);
    }

    initializeMap();

    $(document).on('submit', '.contact-form', function(e) {
      e.preventDefault();

      var $this = $(this),
          str = me.serialize();

      $this.find('input.error, textarea.error').removeClass('error');
      $this.find('small.error').css({'display':'none'});
      $this.find('[data-alert]').css({'display':'none'});

      $.ajax({
        url: $this.attr('action'),
        type: 'POST',
        dataType: 'json',
        data: str,
        complete: function(xhr, textStatus) {

        },
        success: function(data, textStatus, xhr) {
          var statusCode = null,
              successMessage = null,
              errorMessage = null,
              errors = null,
              errorField = null;

          if (window._gaq) {
            _gaq.push(['_trackEvent', 'Forms', 'Submission', 'Contact']);
          }

          if (data.status_code) {
            statusCode = parseInt(data.status_code);
          }

          if (statusCode == 500) {
            if (data.error) {
              errorMessage = data.error;
              $this.find('[data-alert] .message').html(errorMessage);
              $this.find('[data-alert]').addClass('alert').css({'display':'block'});
            }
          }

          if (statusCode == 400) {
            if (data.errors) {
              errors = data.errors;
              for (errorField in errors) {
                $this.find('[name="'+errorField+'"]').addClass('error');
                $this.find('small.error[for="' + errorField + '"]').html(errors[errorField]).css({'display':'block'});
              }
              $this.find('input.error, textarea.error').eq(0).focus();
            }
          }

          if (statusCode == 200) {
            if (data.message) {
              successMessage = data.message;
             }
            $this.find('[data-alert] .message').html(successMessage);
            $this.find('[data-alert]').removeClass('alert').addClass('success').css({'display':'block'});
            $this.find('input[type="text"], input[type="email"], textarea').val('');
          }
        },
        error: function(xhr, textStatus, errorThrown) {
          $this.find('[data-alert] .message').html('Sorry, an error occured.');
          $this.find('[data-alert]').addClass('alert').css({'display':'block'});
        }
      });
    });
  };

  var moogs = new Moogs();

  $(document).on('click', '.input-short-url input', function() {
    $(this).select();
  });

  $(document).ready(function() {
    moogs.initializeGlobal();

    var page = $('body').attr('class');

    if (page === 'home') {
      moogs.initializeHome();
    } else if (page === 'about') {
      moogs.initializeAbout();
    } else if (page === 'resume') {
      moogs.initializeResume();
    } else if (page === 'blog' || page === 'archive') {
      moogs.initializeBlog();
    } else if (page === 'work') {
      moogs.initializeWork();
    } else if (page === 'contact') {
      moogs.initializeContact();
    }
  });

  global.moogs = moogs;
})(this);
