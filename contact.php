<?php
header('Access-Control-Allow-Origin: *');
define("WEBMASTER_EMAIL", 'miguelmota2@gmail.com');

$name = stripslashes($_POST['name']);
$email = $_POST['email'];
$subject = 'contact form';
$message = 'From: '.$name.' <'.$email.'>\r\n Message:\r\n'.stripslashes($_POST['message']);

mail(WEBMASTER_EMAIL, $subject, $message,
     "From: ".$name." <".$email.">rn"
    ."Reply-To: ".$email."rn"
    ."X-Mailer: PHP/" . phpversion());
    
    echo $message;
?>