// CONTACT PAGE SCRIPTS

$(document).ready(function(){

	// Create method to validate name input
	$('.contact-form-submit').live('click', function(){
		$.validator.addMethod('nameCheck', function(value, element){
			return this.optional(element) || /^[a-zA-Z\s]*$/.test(value);
	});
		

		
	// Validate contact form
	$('.contact-form').validate({
		rules: {
			name: {
				nameCheck: true,
				required: true
			},
			email: {
				required: true,
				email: true
			},
			message: {
				required: true,
				minlength: 10
			}
		},
		messages: {
			name: {
				nameCheck: '',
				required: ''
			},
			email: {
				required: '',
				email: ''
			},
			message: {
				required: '',
				minlength: ''
			}
		},
		onkeyup: true,
		success: function(label) {
			label.addClass('valid');	
		}
	});
	
	
	
	// If contact form validates to true then submit it
	if ($('.contact-form').valid() == true){	
		
		$('.contact-form-submit').html('<span>sending...</span>');
		
		var str = $('.contact-form').serialize();
		
		$.ajax({
			type: 'get',
			url: 'http://www.foodfail.org/miguelmota/contact.php',
			// url: 'http://miguelmota.webuda.com/contact/contact.php',
			data: str,
			success: function(){

				sendSuccess();
			},
			error: function(){
				
				sendError();
			}
		});
		return false;
	}
	else
		return false;
	});
	
	
	
	// Hide contact form and display thank you message
	function sendSuccess(){
		var name = $('#contact-form-name').val();
		$('.contact-form').slideUp(300, function(){
			$('.contact-form-thank-you').html('<p class="thank-you-name">Thank you, <strong>'+name+'</strong>.</p><p>Your message has been successfully sent <span class="icon icon-checkmark-16 icon-no-hover icon-no-opacity"></span><br />I will get in touch with you soon.</p>').fadeIn(1200);
		});
	}
	
	
	
	// Display error message submit failed
	function sendError(){
		$('.contact-form').slideUp(300, function(){
			$('.contact-form-thank-you').html('<p>Sorry, there was an error. Message was not sent.</p><p>Email <a href="mailto:hello@miguelmota.com">hello@miguelmota.com</a>?</p>');
		});
	}
	
});
