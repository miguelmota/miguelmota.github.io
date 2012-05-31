// ABOUT PAGE SCRIPTS

$(document).ready(function(){

	initializeAboutMap();
	
});

// Initialize about page map
function initializeAboutMap() {

	var latlng = new google.maps.LatLng(33.934815,-117.547703);
	var myOptions = {
			zoom: 5,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

	var map = new google.maps.Map(document.getElementById('mapabout'), myOptions);

	var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: "Norco, CA"
		});
	
	marker.setAnimation(google.maps.Animation.DROP);
}