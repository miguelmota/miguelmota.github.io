// ABOUT PAGE SCRIPTS

$(document).ready(function(){

	initializeAboutMap();
	
});

// Initialize about page map
function initializeAboutMap() {

	var latlng = new google.maps.LatLng(33.934815,-117.547703);
	var infowindow = new google.maps.InfoWindow({
		content: ""
	});

	var myOptions = {
			zoom: 5,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

	var map = new google.maps.Map(document.getElementById('mapabout'), myOptions);

	var htmlContent = "<div class='gmap-infowindow'>"+
	"<span class='gmap-infowindow-location'>Norco, CA, USA</span></div>";

	var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: "Norco, CA",
			html: htmlContent
		});

	var oblivionStyles = [
		{
			featureType: "all",
			stylers: [
				//{ invert_lightness: true },
				//{ hue: "#0077ff" }
			]
		}
	];

	map.setOptions({styles: oblivionStyles});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(this.html);
		infowindow.open(map, this);
		map.setZoom(10);
		map.panTo(marker.position);
	});
	
	marker.setAnimation(google.maps.Animation.DROP);
}