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
<title></title>
<head>
<link href='http://www.miguelmota.com/styles/reset.min.css' rel='stylesheet' />
<link href='http://www.miguelmota.com/styles/global.css' rel='stylesheet' />
<script src='http://www.miguelmota.com/scripts/jquery.min.js'></script>
<style>
body {
	background-color: #222;
	display: block;
}
</style>
</head>
<body>
<?
echo "<div class='location'><a style='color: #007299;' href='http://maps.google.com/?q=$place' rel='external' target='_blank' title='".$coordinates."'>$place</a> <time class='status-date'>".getRelativeTime($timestamp)."</time></div>";

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
<div id='latcoords2'></div>
<script>
/*
//$.getJSON(eval("http://www.foodfail.org/miguelmota/latitude.json"),
$.getJSON(eval("http://www.google.com/latitude/apps/badge/api?user=7812482200199007583&type=json"),
	function(data){
		$.each(data, function(i, item){
			var coords = item.features[0].geometry.coordinates[0];
	      	$('#latcoords').append("<span>"+coords+"</span>");
		});
	}
);*/
</script>
</body>
</html>
