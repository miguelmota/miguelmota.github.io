<?php
header('Access-Control-Allow-Origin: *');
define('WEBMASTER_EMAIL', 'miguelmota2@gmail.com');

$name = stripslashes($_GET['name']);
$email = stripslashes($_GET['email']);
$subject = 'Contact Form | Miguel Mota';
$message = 'From: '.$name.' <'.$email.">\nMessage: \n".stripslashes($_GET['message']);

mail(WEBMASTER_EMAIL, $subject, $message,
     'From: '.$name.' <'.$email.">\n"
    .'Reply-To: '.$email."\n"
    .'X-Mailer: PHP/'.phpversion());
?>