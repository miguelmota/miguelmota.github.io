<?php

	date_default_timezone_set('America/Los_Angeles');

	include 'sendgrid-php/SendGrid_loader.php';
	$sendgrid = new SendGrid('miguelmota', 'b938ed2a580bcec0');

	$to = 'miguelmota2@gmail.com';

	$name      = isset($_REQUEST['name']) ? ucfirst($_REQUEST['name']) : null;
	$email     = isset($_REQUEST['email']) ? $_REQUEST['email'] : null;
	$message   = isset($_REQUEST['message']) ? ucfirst($_REQUEST['message']) : null;

	$errors = array();

	if (empty($name)) {
		$errors['name'] = 'Name is required';
	}
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		$errors['email'] = 'Email is invalid';
	}
	if (empty($email)) {
		$errors['email'] = 'Email is required';
	}
	if (empty($message)) {
		$errors['message'] = 'Message is required';
	}

	if (!empty($errors)) {
		$statusCode = 400;
		$json = array(
			'status_code' => $statusCode,
			'errors' => $errors
		);
	} else {

		$mailSubject = 'Contact Form » Miguel Mota | Web Developer';
		$date = date('d M Y h:i A');

		$mailMessage = 'You have a new contact form submission <br /><br />'.
				   'Name: ' . $name . " <br />".
				   'Email: ' . $email . " <br />".
				   'Message: ' . $message . " <br />".
				   'Date: ' . $date . ' <br />';

			$mail = new SendGrid\Mail();
			$mail->
			  addTo($to)->
			  setFrom($email)->
			  setSubject($mailSubject)->
			  setText(strip_tags($mailMessage))->
			  setHtml($mailMessage);

			if ($sendgrid->web->send($mail)) {
				$statusCode = 200;
				$json = array(
					'status_code' => $statusCode
				);
			} else {
				$send = sendMail($to, $mailSubject, $mailMessage, $email, $name);
				$statusCode = 500;
				$errorMessage = 'Sorry, an error occured.';
				$json = array(
					'status_code' => $statusCode,
					'error' => $errorMessage
				);
			}
	}

	echo json_encode($json);

	function sendMail($to, $subject, $message, $from, $fromName) {
		$mailHeaders  = "MIME-Version: 1.0\r\n";
		$mailHeaders .= "Content-type: text/html; charset=iso-8859-1\r\n";
		$mailHeaders .= "From: ".$fromName."<".$from.">\r\n";
		$mailHeaders .= "Reply-To: ".$fromName."<".$from.">\r\n";
		$mailHeaders .= "X-Mailer: PHP/".phpversion();

		$result = mail($to,$subject,$message,$mailHeaders);

		return (($result) ? true : false);
	}

?>