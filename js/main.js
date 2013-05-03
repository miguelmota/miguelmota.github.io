//main.js

var MM = MM || (function() {

	return {
		initialize: function() {
			$(document).foundation();
		},
		work: function() {
			var slider = $('#work-slider'),
			navPrevSelector = $('#slide-prev'),
			navNextSelector = $('#slide-next'),
			navSlideSelector = $('#dots').find('.dot'),
			autoSlideTimer = 10000,
			autoSlideTransTimer = 500,
			transitionDuration = 500,
			repositionDuration = 800,
			slideContentChange = function(args) {
				if (!args.slideChanged) return false;
				hideDevices(args);
				transitionDevices(args);
				updateDots(args);
				updateNavSelector(args);
			},
			slideContentComplete = function(args) {},
			slideContentLoaded = function(args) {
				transitionDevices(args);
				updateDots(args);
				updateNavSelector(args);
			},
			updateDots = function(args) {
				slider.find('#dots').find('.dot').removeClass('active');
				slider.find('#dots').find('.dot').eq(args.currentSlideNumber - 1).addClass('active');
			},
				updateNavSelector = function(args) {
					if (args.currentSlideNumber == args.data.numberOfSlides)
			       navNextSelector.addClass('disabled');
			    else
			       navNextSelector.removeClass('disabled');

			    if (args.currentSlideNumber == 1)
			       navPrevSelector.addClass('disabled');
			    else
			      navPrevSelector.removeClass('disabled');

				},
			transitionDevices = function(args) {
				transitionDesktop(args);
			},
			transitionDesktop = function(args) {
				slider.find('.slide').eq(args.currentSlideNumber - 1).find('.desktop').transition({
					opacity: 1,
					duration: transitionDuration,
					easing: 'in',
					translate: [100, +10],
					complete: function() {
						transitionLaptop(args);
					}
				});
			},
			transitionLaptop = function(args) {
				slider.find('.slide').eq(args.currentSlideNumber - 1).find('.laptop').transition({
					opacity: 1,
					duration: transitionDuration,
					easing: 'in',
					translate: [100,-10],
					complete: function() {
						transitionTablet(args);
					}
				});
			},
			transitionTablet = function(args) {
				slider.find('.slide').eq(args.currentSlideNumber - 1).find('.tablet').transition({
					opacity: 1,
					duration: transitionDuration,
					easing: 'in',
					translate: [-100, 10],
					complete: function() {
						transitionMobile(args);
					}
				});
			},
			transitionMobile = function(args) {
				slider.find('.slide').eq(args.currentSlideNumber - 1).find('.mobile').transition({
					opacity: 1,
					duration: transitionDuration,
					easing: 'in',
					translate: [-100,-10],
					complete: function() {
						repositionDevices(args);
					}
				});
			},
			repositionDevices = function (args) {
				if (!slider.find('.slide').eq(args.currentSlideNumber - 1).find("img").css('translate')) {
					return false;
				}
				var xDesktop = parseInt(slider.find('.slide').eq(args.currentSlideNumber - 1).find(".desktop").css('translate').split(',')[0]),
				yDesktop = parseInt(slider.find('.slide').eq(args.currentSlideNumber - 1).find(".desktop").css('translate').split(',')[1]),
				xLaptop = parseInt(slider.find('.slide').eq(args.currentSlideNumber - 1).find(".laptop").css('translate').split(',')[0]),
				yLaptop = parseInt(slider.find('.slide').eq(args.currentSlideNumber - 1).find(".laptop").css('translate').split(',')[1]),
				xTablet = parseInt(slider.find('.slide').eq(args.currentSlideNumber - 1).find(".tablet").css('translate').split(',')[0]),
				yTablet = parseInt(slider.find('.slide').eq(args.currentSlideNumber - 1).find(".tablet").css('translate').split(',')[1]),
				xMobile = parseInt(slider.find('.slide').eq(args.currentSlideNumber - 1).find(".mobile").css('translate').split(',')[0]),
				yMobile = parseInt(slider.find('.slide').eq(args.currentSlideNumber - 1).find(".mobile").css('translate').split(',')[1]);

				slider.find('.slide').eq(args.currentSlideNumber - 1).find('.desktop').transition({
					translate: [xDesktop, yDesktop - 10],
					duration: repositionDuration,
					easing: 'in',
					complete: function() {}
				});
				slider.find('.slide').eq(args.currentSlideNumber - 1).find('.laptop').transition({
					translate: [xLaptop, yLaptop + 10],
					duration: repositionDuration,
					easing: 'in',
					complete: function() {}
				});
				slider.find('.slide').eq(args.currentSlideNumber - 1).find('.tablet').transition({
					translate: [xTablet, yTablet - 10],
					duration: repositionDuration,
					easing: 'in',
					complete: function() {}
				});
				slider.find('.slide').eq(args.currentSlideNumber - 1).find('.mobile').transition({
					translate: [xMobile, yMobile + 10],
					duration: repositionDuration,
					easing: 'in',
					complete: function() {
						transitionCaption(args);
					}
				});
			},
			hideDevices = function(args) {
				slider.find('img, .caption, .site').css({ opacity: 0, '-moz-transform': '', '-webkit-transform': '', 'transform': '' }).end()
				.find('.desktop').css({ left: -100, bottom: 0 }).end()
				.find('.laptop').css({ left: -100, bottom: 0 }).end()
				.find('.tablet').css({ right: -100, bottom: 0 }).end()
				.find('.mobile').css({ right: -100, bottom: 0 }).end()
				.find('.caption').css({ left: 0, top: -10 }).end();
			},
			transitionCaption = function(args) {
				slider.find('.slide').eq(args.currentSlideNumber - 1).find('.caption').transition({
					opacity: 1,
					duration: transitionDuration,
					easing: 'in',
					translate: [0, 10]
				});
				slider.find('.slide').eq(args.currentSlideNumber - 1).find('.site').transition({
					opacity: 1,
					duration: transitionDuration,
					easing: 'in'
				});
			}

			hideDevices();

			slider.iosSlider({
				scrollbar: false,
				snapToChildren: true,
				desktopClickDrag: true,
				responsiveSlideWidth: true,
				responsiveSlides: true,
				navPrevSelector: navPrevSelector,
				navNextSelector: navNextSelector,
				navSlideSelector: navSlideSelector,
				infiniteSlider: false,
				autoSlide: true,
				autoSlideTimer: autoSlideTimer,
				autoSlideTransTimer: autoSlideTransTimer,
				onSlideChange: slideContentChange,
				onSlideComplete: slideContentComplete,
				onSliderLoaded: slideContentLoaded
			});
		},
		contact: function() {
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

				latlng = new google.maps.LatLng(34.0452,-118.284);

				mapOptions = {
					zoom: 5,
					center: latlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					animation: google.maps.Animation.DROP,
					scrollwheel: false,
					disableDefaultUI: true
				};

				map = new google.maps.Map(document.getElementById("map"), mapOptions);

				mapStyles = [{
					"stylers": [{
							"hue": "#91ff00"
						},
						{
							"saturation": -80
						}]
				}];

				map.setOptions({
					styles: mapStyles
				});

				markerImage = new google.maps.MarkerImage("/img/map-marker.png");

				markerShadow = new google.maps.MarkerImage(
					"/img/map-marker-shadow.png",
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
	  		           background: "url('/img/map-tipbox-top.gif') no-repeat",
	  		           opacity: 0.75,
	  		           width: "200px"
	  		      },
	  		      closeBoxMargin: "12px 2px 4px 2px",
	  		      closeBoxURL: "/img/map-close-icon.png",
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

			google.maps.event.addDomListener(window, 'load', initializeMap);

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
				      me.find('[data-alert]').addClass('success').css({'display':'block'});
				      me.find('input[type="text"], input[type="email"], textarea').val('');
				    }
				  },
				  error: function(xhr, textStatus, errorThrown) {
				  	me.find('[data-alert] .message').html('Sorry, an error occured.');
				  	me.find('[data-alert]').addClass('alert').css({'display':'block'});
				  }
				});
			});
		}
	};
})();


$(document).on('click', '.input-short-url input', function() {
	$(this).select();
});

$(document).ready(function() {
	var page;

	MM.initialize();

	page = $('body').attr('id');
	switch(page) {
		case 'contact':
			MM.contact();
			break;
		case 'work':
			MM.work();
			break;
		default:
			break;
	}
});