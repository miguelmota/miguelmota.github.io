<?php 

//v2.1: Properly decodes JSON using PHP's inbuilt functions
//v2: now returns time since I last checked in to Google Latitude.

$info = file_get_contents("http://www.google.com/latitude/apps/badge/api?user=7812482200199007583&type=json");

$latitude=json_decode($info,true);
$place=$latitude["features"]["0"]["properties"]["reverseGeocode"];
$timestamp=$latitude["features"]["0"]["properties"]["timeStamp"];

 $lat = $latitude["features"]["0"]["geometry"]["coordinates"][0];
 $long = $latitude["features"]["0"]["geometry"]["coordinates"][1];
 $coordinates = $long.", ".$lat;
 
?>
<!doctype html>
<html>
<head>
<title>Latitude | Miguel Mota</title>
<link rel='shortcut icon' href='http://www.miguelmota.com/favicon.ico' />
<link href='http://www.miguelmota.com/styles/reset.min.css' rel='stylesheet' />
<script src='http://www.miguelmota.com/scripts/jquery.min.js'></script>
<script src='http://maps.google.com/maps/api/js?sensor=false'></script>
<script>
$(document).ready(function(){
	
	initialize();
	
});

function initialize() {

	var latlng = new google.maps.LatLng(<?php echo $coordinates; ?>);
	var myOptions = {
			zoom: 9,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

	var map = new google.maps.Map(document.getElementById('map'), myOptions);

	var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: "<?php echo $place; ?>"
		});
	
	marker.setAnimation(google.maps.Animation.DROP);
	
}
</script>
<style>
html, body {
	height: 100%;
	width: 100%;
}
#map {
	height: 100%;
	width: 100%;
}
</style>
</head>
<body>
<div id='map'></div>
</body>
</html>
