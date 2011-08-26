<?php
header('Access-Control-Allow-Origin: *');
define("WEBMASTER_EMAIL", 'miguelmota2@gmail.com');

$name = stripslashes($_POST['name']);
$email = stripslashes($_POST['email']);
$subject = 'Contact Form | Miguel Mota';
$message = 'From: '.$name.' <'.$email."> \n Message9: \n".stripslashes($_POST['message']);

mail(WEBMASTER_EMAIL, $subject, $message,
     "From: ".$name." <".$email.">rn"
    ."Reply-To: ".$email."rn"
    ."X-Mailer: PHP/" . phpversion());
    
    echo $message;
?>