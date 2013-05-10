//main.js

var Moogs = function() {

};

Moogs.prototype.initializeGlobal = function() {
	$(document).foundation();
};

window.appendLoader = function(obj) {
	var loader = $('<div id="loader"></div>');
	obj.append(loader);
	window.loader = $('#loader');
};

Moogs.prototype.initializeAbout = function() {

}

Moogs.prototype.initializeResume = function() {
	Moogs.prototype.initializeParticles();
}

Moogs.prototype.initializeHome = function() {
	Moogs.prototype.initializeParticles();
	Moogs.prototype.initializeSocialSlider();
}

Moogs.prototype.initializeBlog = function() {
	Moogs.prototype.initializeParticles();
}

Moogs.prototype.initializeParticles = function() {
	var width,
	height,
	canvas,
	context,
	particleCount = 100,
	gradient,
	particles = new Array(),
	speed = 60;

	window.addEventListener('DOMContentLoaded', function() {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas = document.getElementById('canvas');
		canvas.width = width;
		canvas.height = height;
		canvas.style.position = 'absolute';
		context = canvas.getContext('2d');
		for (var i = 0; i < particleCount; i++) {
			particles[i] = new Particle();
			particles[i].reset();
		}
		setInterval(draw,speed);
	}, false);

	var draw = function() {
		context.clearRect(0,0,width,height);
		for (var i = 0; i < particles.length; i++) {
			particles[i].fade();
			particles[i].move();
			particles[i].draw();
		}
	}

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
		// var colorStop1 = '255,255,255',
		// colorStop2 = '77,101,181',
		// colorStop3 = '77,101,181';
		var colorStop1 = '74,108,114',
		colorStop2 = '99,139,147',
		colorStop3 = '99,139,147';
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
};

Moogs.prototype.initializeSocialSlider = function() {
		var swiper = $('#swipe'),
		swiperSlider = swiper.swiper({
			slidesPerSlide : 'auto',
			simulateTouch: false,
			slideClass : 'swipe-slide',
			wrapperClass : 'swipe-wrapper',
		});

		var resetSlider = function() {
			swiper.find('.swipe-wrapper').css({
				'transform': 'translate3d(0, 0, 0)'
			});
		};

		$(window).on('resize', function() {
			setTimeout(resetSlider, 10);
		});
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
				if (args.currentSlideNumber == args.data.numberOfSlides) {
		       Slider.prototype.navNextSelector.addClass('disabled');
		    } else {
		       Slider.prototype.navNextSelector.removeClass('disabled');
		   }

		    if (args.currentSlideNumber == 1) {
		       Slider.prototype.navPrevSelector.addClass('disabled');
		    } else {
		      Slider.prototype.navPrevSelector.removeClass('disabled');
		    }
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