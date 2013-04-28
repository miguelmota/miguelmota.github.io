//main.js

var MM = MM || (function() {

	return {
		initialize: function() {
			$(document).foundation();
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
	  		       pixelOffset: new google.maps.Size(-100, -65),
	  		       zIndex: null,
	  		       position: new google.maps.LatLng(34.0452,-118.284),
	  		       boxStyle: {
	  		           background: "url('/img/map-tipbox-bottom.gif') no-repeat",
	  		           opacity: 0.75,
	  		           width: "200px"
	  		      },
	  		      closeBoxMargin: "4px 2px 12px 2px",
	  		      closeBoxURL: "/img/map-close-icon.png",
	  		      infoBoxClearance: new google.maps.Size(1, 1),
	  		      isHidden: false,
	  		      alignBottom: true,
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
				      }
				    }

				    if (statusCode == 200) {
				      me.find('[data-alert] .message').html('Successfully sent');
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


$(document).on('click', '.input-short-url', function() {
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
		default:
			break;
	}
});