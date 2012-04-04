<?php
header('Access-Control-Allow-Origin: *');
define('WEBMASTER_EMAIL', 'miguelmota2@gmail.com');

$name = stripslashes($_GET['name']);
$email = stripslashes($_GET['email']);
$subject = 'Contact '.html_entity_decode('&#187;', ENT_QUOTES, 'utf-8').' Miguel Mota';
$message = 'From: '.$name.' <'.$email.">\nMessage: \n".stripslashes($_GET['message']);

mail(WEBMASTER_EMAIL, $subject, $message,
     'From: '.$name.' <'.$email.">\n"
    .'Reply-To: '.$email."\n"
    .'X-Mailer: PHP/'.phpversion());
?>