// PORTFOLIO SCRIPTS

$(document).ready(function(){

	// Set portfolio sort cookie
	if($.cookie('portfolioSort') == null) {
		$.cookie('portfolioSort', 'all', {
				expires: 7,
				path: '/'
			}
		);
	}
	
	// Sort blog posts based on cookie
	if ($.cookie('portfolioSort') == 'all') {
		portfolioSortAll();
	}
	else if ($.cookie('portfolioSort') == 'web') {
		portfolioSortWeb();
	}
	else if($.cookie('portfolioSort') == 'logo') {
		portfolioSortLogo();
	}
	else if($.cookie('portfolioSort') == 'code') {
		portfolioSortCode();
	}
	else {
		$.cookie('portfolioSort', 'all');
	}


	
	// Project hover border glow effect
	$(".project .image-container").live({
		mouseenter:
			function(){
				// jQuery('.overlay', this).fadeOut(200);
				$(this).css({
					'border-color': '#007299',
					'-webkit-box-shadow': '0 0 10px #fff',
					'-moz-box-shadow': '0 0 10px #fff',
					'box-shadow': '0 0 10px #fff'
					});
		},
		mouseleave:
			function(){
				// jQuery('.overlay', this).hide().fadeIn(300);
				$(this).css({
					'border-color': 'transparent',
					'-webkit-box-shadow': '2px 2px 5px #111',
					'-moz-box-shadow': '2px 2px 5px #111',
					'box-shadow': '2px 2px 5px #111'
					});
		}
	});
	
	
	
	// Show overlay popup on project hover
	$('.project').live({
		mouseenter:
			function(){
				jQuery('.project-overlay-popup', this).animate({bottom: '0'}, {queue: false, duration: 150});
		},
		mouseleave:
			function(){
				jQuery('.project-overlay-popup', this).animate({bottom: '-100px'}, {queue: false, duration: 125});
		}
	});
	

	
	// Initialize Fancybox
	initializeFancybox();

	var $container = $('.project-images-wrap');

	if(window.width <= 640){
		$container = '';
	}
	
	$container.imagesLoaded(function(){
	  $container.masonry({
	  	itemSelector: '.project-image',
	    isFitWidth: true
	  });
	});

	
});

/* ------------------------
 * Project sort functions
 * --------------------- */

// Show all work
function portfolioSortAll() {
	$('.project-sort-wrap a').removeClass('selected');
	$('.project-sort-all').addClass('selected');
	$('.project').slideDown('fast');
	$.cookie('portfolioSort', 'all');
}

// Show web work
function portfolioSortWeb() {
	$('.project-sort-wrap a').removeClass('selected');
	$('.project-sort-web').addClass('selected');
	$(".project:not('.project-web')").slideUp('fast');
	$('.project-web').slideDown('fast');
	$.cookie('portfolioSort', 'web');
}

// Show logo work
function portfolioSortLogo() {
	$('.project-sort-wrap a').removeClass('selected');
	$('.project-sort-identity').addClass('selected');
	$(".project:not('.project-identity')").slideUp('fast');
	$('.project-identity').slideDown('fast');
	$.cookie('portfolioSort', 'logo');
}

// Show code work
function portfolioSortCode() {
	$('.project-sort-wrap a').removeClass('selected');
	$('.project-sort-code').addClass('selected');
	$(".project:not('.project-code')").slideUp('fast');
	$('.project-code').slideDown('fast');
	$.cookie('portfolioSort', 'code');
}





	
