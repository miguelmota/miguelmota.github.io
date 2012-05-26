<?php 
    $info = file_get_contents("http://www.google.com/latitude/apps/badge/api?user=7812482200199007583&type=json");

    $json = json_decode($info,true);
    $place = $json["features"][0]["properties"]["reverseGeocode"];
    $timestamp = $json["features"][0]["properties"]["timeStamp"];

    $lat = $json["features"][0]["geometry"]["coordinates"][0];
    $lng = $json["features"][0]["geometry"]["coordinates"][1];
    $coordinates = $lng.",".$lat;

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
    <link href='http://www.miguelmota.com/styles/global.css' rel='stylesheet' />
    <script src='http://code.jquery.com/jquery.min.js'></script>
    <script>
        $(document).ready(function(){
            // Open external links in new tab
            $('a[rel*=external]').live('click', function(){
                window.open(this.href);
                return false;
            });
            // Highlight icon on link hover
            $('a').has('.icon').hover(
                function(){
                    $('.icon', this).addClass('icon-no-opacity');
                },
                function(){
                    $('.icon', this).removeClass('icon-no-opacity');
                }
            );
        });
    </script>
    <style>
        body {
        	background-color: #141414;
        	display: block;
        }
        a {
            background: #141414;
            color: #007299;
            display: block;
            padding: 5px;
        }
        a:hover {
            background: #000;
        }
        .icon-no-opacity {
            opacity: 1;
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
            filter: alpha(opacity=100);
        }
        .icon-no-opacity:hover,
        .icon-no-opacity:active {
            opacity: 1;
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
            filter: alpha(opacity=100);
        }
        .status-date {
            color: #999;
            font-size: 12px;
            font-weight: normal;
            float: right;
        }
    </style>
</head>
<body>
<?php
    echo "<a href='http://maps.google.com/?q=$coordinates' rel='external'><span class='icon icon-location-marker-16'></span> $place <time class='status-date'>".getRelativeTime($timestamp)."</time></a>";
?>
</body>
</html>
