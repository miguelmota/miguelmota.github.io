//main.js

var Moogs = function() {

};

Moogs.prototype.initializeGlobal = function() {
	$(document).foundation();
};

window.appendLoader = function(obj) {
	var loader = $('<div id="loader"><div class="bubbling"><span id="bubbling-1"></span><span id="bubbling-2"></span><span id="bubbling-3"></span></div></div>');
	obj.append(loader);
	window.loader = $('#loader');
};

Moogs.prototype.initializeWork = function() {

	var Slider = function() {
		window.appendLoader(Slider.prototype.slider);
		Slider.prototype.hideDevices();
	};

	Slider.prototype = {
		slider: $('#work-slider'),
		navPrevSelector: $('#slide-prev'),
		navNextSelector: $('#slide-next'),
		navSlideSelector: $('#dots').find('.dot'),
		autoSlideTimer: 10000,
		autoSlideTransTimer: 500,
		transitionDuration: 500,
		repositionDuration: 800,
		transitionsDone: true,
		currentSlideNumber: 0,

		initialize: function() {

			Slider.prototype.slider.iosSlider({
				scrollbar: false,
				snapToChildren: true,
				desktopClickDrag: true,
				responsiveSlideWidth: true,
				responsiveSlides: true,
				navPrevSelector: Slider.prototype.navPrevSelector,
				navNextSelector: Slider.prototype.navNextSelector,
				navSlideSelector: Slider.prototype.navSlideSelector,
				infiniteSlider: false,
				autoSlide: true,
				autoSlideTimer: Slider.prototype.autoSlideTimer,
				autoSlideTransTimer: Slider.prototype.autoSlideTransTimer,
				onSlideChange: Slider.prototype.slideContentChange,
				onSlideComplete: Slider.prototype.slideContentComplete,
				onSliderLoaded: Slider.prototype.slideContentLoaded
			});

		},

		slideContentChange: function(args) {
			if (!args.slideChanged) return false;
			Slider.prototype.currentSlideNumber = args.currentSlideNumber - 1;
			Slider.prototype.hideDevices(args);
			Slider.prototype.updateDots(args);
			Slider.prototype.updateNavSelector(args);
			Slider.prototype.transitionDevices(args);
		},

		slideContentComplete: function(args) {

		},

		slideContentLoaded: function(args) {
			window.loader.remove();
			Slider.prototype.transitionDevices(args);
			Slider.prototype.updateDots(args);
			Slider.prototype.updateNavSelector(args);
		},

		updateDots: function(args) {
			Slider.prototype.slider.find('#dots').find('.dot').removeClass('active');
			Slider.prototype.slider.find('#dots').find('.dot').eq(Slider.prototype.currentSlideNumber).addClass('active');
		},

		updateNavSelector: function(args) {
				if (args.currentSlideNumber == args.data.numberOfSlides)
		       Slider.prototype.navNextSelector.addClass('disabled');
		    else
		       Slider.prototype.navNextSelector.removeClass('disabled');

		    if (args.currentSlideNumber == 1)
		       Slider.prototype.navPrevSelector.addClass('disabled');
		    else
		      Slider.prototype.navPrevSelector.removeClass('disabled');
		},

		transitionDevices: function(args) {

			var xDesktop,
			yDesktop,
			xLaptop,
			yLaptop,
			xTablet,
			yTablet,
			xMobile,
			yMobile;

			Slider.prototype.transitionsDone = false;

			var transitionDesktop = function() {
				Slider.prototype.slider.find('.slide').eq(Slider.prototype.currentSlideNumber).find('.desktop').transition({
					opacity: 1,
					duration: Slider.prototype.transitionDuration,
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
				Slider.prototype.slider.find('.slide').eq(Slider.prototype.currentSlideNumber).find('.laptop').transition({
					opacity: 1,
					duration: Slider.prototype.transitionDuration,
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
				Slider.prototype.slider.find('.slide').eq(Slider.prototype.currentSlideNumber).find('.tablet').transition({
					opacity: 1,
					duration: Slider.prototype.transitionDuration,
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
				Slider.prototype.slider.find('.slide').eq(Slider.prototype.currentSlideNumber).find('.mobile').transition({
					opacity: 1,
					duration: Slider.prototype.transitionDuration,
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

				Slider.prototype.slider.find('.slide').eq(Slider.prototype.currentSlideNumber).find('.desktop').transition({
					translate: [xDesktop, yDesktop - 10],
					duration: Slider.prototype.repositionDuration,
					easing: 'in',
					complete: function() {}
				});

				Slider.prototype.slider.find('.slide').eq(Slider.prototype.currentSlideNumber).find('.laptop').transition({
					translate: [xLaptop, yLaptop + 10],
					duration: Slider.prototype.repositionDuration,
					easing: 'in',
					complete: function() {}
				});

				Slider.prototype.slider.find('.slide').eq(Slider.prototype.currentSlideNumber).find('.tablet').transition({
					translate: [xTablet, yTablet - 5],
					duration: Slider.prototype.repositionDuration,
					easing: 'in',
					complete: function() {}
				});

				Slider.prototype.slider.find('.slide').eq(Slider.prototype.currentSlideNumber).find('.mobile').transition({
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
				Slider.prototype.slider.find('.slide').eq(Slider.prototype.currentSlideNumber).find('.caption').transition({
					opacity: 1,
					duration: Slider.prototype.transitionDuration,
					easing: 'in',
					translate: [0, 10],
					complete: function() {
						Slider.prototype.transitionsDone = true;
						return true;
					}
				});
				Slider.prototype.slider.find('.slide').eq(Slider.prototype.currentSlideNumber).find('.site').transition({
					opacity: 1,
					duration: Slider.prototype.transitionDuration,
					easing: 'in',
					complete: function() {
					}
				});
			}

			transitionDesktop();

		},

		hideDevices: function() {
			Slider.prototype.slider.find('img, .caption, .site').css({ opacity: 0, '-moz-transform': '', '-webkit-transform': '', 'transform': '' }).end()
			.find('.desktop').css({ left: -100, bottom: -10 }).end()
			.find('.laptop').css({ left: -100, bottom: -5 }).end()
			.find('.tablet').css({ right: -100, bottom: -10 }).end()
			.find('.mobile').css({ right: -100, bottom: -10 }).end()
			.find('.caption').css({ left: 0, top: -10 }).end();
		}

	};

	var slider = new Slider();
	$(window).load(function() {
		var scrollTop = 200;
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
	});
};

Moogs.prototype.initializeContact = function() {
	var initializeMap = function() {
		var map,
				marker,
				latlng,
				mapOptions,
				mapStyles,
				markerImage,
				markerShadow,
				infoWindodw,
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
		case 'contact':
			moogs.initializeContact();
			break;
		case 'work':
			moogs.initializeWork();
			break;
		default:
			break;
	}
});