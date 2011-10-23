<!doctype html>
<html>
<title></title>
<link href='http://www.miguelmota.com/styles/reset.css' rel='stylesheet' />
<link href='http://www.miguelmota.com/styles/global.css' rel='stylesheet' />
<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js'></script>
<script>
$(document).ready(function(){
	// Open external links in new tab
	$('a[rel*=external]').live('click', function(){
		window.open(this.href);
		return false;
	});
});
</script>
<body style='display: block;'>

<?

//v2.1: Properly decodes JSON using PHP's inbuilt functions
//v2: now returns time since I last checked in to Google Latitude.

$info = file_get_contents("http://www.google.com/latitude/apps/badge/api?user=7812482200199007583&type=json");

$latitude=json_decode($info,true);
$place=$latitude["features"]["0"]["properties"]["reverseGeocode"];
$timestamp=$latitude["features"]["0"]["properties"]["timeStamp"];

echo "<div class='location'><a href='http://maps.google.com/?q=$place' rel='external'>$place</a> <time class='status-date'>".getRelativeTime($timestamp)."</time></div>";

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
</body>
</html>
