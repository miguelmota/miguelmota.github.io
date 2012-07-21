<?php 
	$data = file_get_contents("http://www.google.com/latitude/apps/badge/api?user=7812482200199007583&type=json");

	$json = json_decode($data, true);
	$place = $json["features"][0]["properties"]["reverseGeocode"];
	$timestamp = $json["features"][0]["properties"]["timeStamp"];
	$photo = $json["features"][0]["properties"]["placardUrl"];

	$lat = $json["features"][0]["geometry"]["coordinates"][0];
	$lng = $json["features"][0]["geometry"]["coordinates"][1];
	$coordinates = $lng.", ".$lat;


	function plural($num) {
	    if ($num != 1)
	        return "s";
	}

	function getRelativeTime($date) {
	    $diff = time() - $date;
	    if ($diff<60)
	        return $diff . " second" . plural($diff) . " ago";
	    $diff = round($diff/60);
	    if ($diff<60)
	        return $diff . " minute" . plural($diff) . " ago";
	    $diff = round($diff/60);
	    if ($diff<24)
	        return $diff . " hour" . plural($diff) . " ago";
	    $diff = round($diff/24);
	    if ($diff<7)
	        return $diff . " day" . plural($diff) . " ago";
	    $diff = round($diff/7);
	    if ($diff<4)
	        return $diff . " week" . plural($diff) . " ago";
	    return "on " . date("F j, Y", strtotime($date));
	}
 
?>
<!doctype html>
<html>
<head>
	<title>Latitude | Miguel Mota</title>
	<link rel='shortcut icon' href='http://www.miguelmota.com/favicon.ico' />
	<link href='http://www.miguelmota.com/styles/reset.min.css' rel='stylesheet' />
	<script src='http://code.jquery.com/jquery.min.js'></script>
	<script src='http://maps.google.com/maps/api/js?sensor=false'></script>
	<script>
		$(document).ready(function(){
			
			initialize();
			
		});

		function initialize() {

			var latlng = new google.maps.LatLng(<?php echo $coordinates; ?>);
			var infowindow = new google.maps.InfoWindow({
				content: ""
			});

			var myOptions = {
					zoom: 9,
					center: latlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

			var map = new google.maps.Map(document.getElementById('gmap'), myOptions);

			var htmlContent = "<div class='gmap-infowindow'>"+
			"<span class='gmap-infowindow-location'><?php echo $place; ?></span>"+
			"<span class='gmap-infowindow-coords'><?php echo $coordinates; ?></span>" +
			"<span class='gmap-infowindow-time'><?php echo getRelativeTime($timestamp); ?></span></div>";

			var image = new google.maps.MarkerImage('<?php echo $photo; ?>');

			var marker = new google.maps.Marker({
					position: latlng,
					map: map,
					icon: image,
					title: "<?php echo $place; ?>",
					html: htmlContent
				});

			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(this.html);
				infowindow.open(map, this);
				map.setZoom(16);
				map.panTo(marker.position);
			});
			
			marker.setAnimation(google.maps.Animation.DROP);
			
		}
	</script>
	<style>
	html, body {
		height: 100%;
		width: 100%;
	}
	#gmap {
		height: 100%;
		width: 100%;
	}
	.gmap-infowindow {
		overflow: hidden;
	}
	.gmap-infowindow-location {
		color: #333;
		display: block;
		font-size: 16px;
		font-weight: bold;
		margin: 0 0 5px 0;
	}
	.gmap-infowindow-coords {
		color: #999;
		display: block;
	}
	.gmap-infowindow-time {
		color: #555;
		display: block;
	}
	</style>
</head>
<body>
	<div id='gmap'></div>
</body>
</html>