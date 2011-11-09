$(document).ready(function(){

	// Initialize side nav text ticker; NOTE: might cause bug in Firefox
	textTicker();
	
	
	
	// Add selected class to nav link based on page content class name
	$('.main-side-nav-ul a').each(function(){ 
		if($(this).attr('id') == $('.content').attr('class').split(' ')[1]){
			$('#stream').removeClass('selected');
			$(this).addClass('selected');
				switch($('.content').attr('class').split(' ')[1]){
				case 'stream':
					streamPage();
					break;
				case 'about':
					break;
				case 'portfolio':
					portfolioPage();
					break;
				case 'contact':
					contactPage();
					break;
				case 'blog':
					blogPage();
				default:
					break;
			}
		}
		
	});
	
	

	// Navigation hover effect
	$('.main-side-nav-ul a').hover(
			function(){
				$(this).animate({borderLeftWidth: '6px'}, {queue: false, duration: 60});
			},
			function(){
				$(this).animate({borderLeftWidth: '4px'}, {queue: false, duration: 60});
			}
		);
		
		
	
	// Change default text color on input focus
	$('input:text, input:password, textarea').focus(function(){
		$(this).css('color', '#999');
	});
	
	

	// Make navigation absolute on mobile screens
	if(screen.width <= 640){
		$('.main-side-nav').css({
			'position': 'absolute'
		});
	}
	
	
	
	// Open external links in new tab
	$('a[rel*=external]').live('click', function(){
		window.open(this.href);
		return false;
	});
	
	// Don't open link if rel = internal
	$('a[rel*=internal]').live('click', function(e){
		e.preventDefault();
		return false;
	});
	
	
	
	// Initialize Fancybox
	initializeFancybox();

	
	
	// Back to top smooth scroll effect
	$('a[href*=#]').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
		&& location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
            if ($target.length) {
            	var targetOffset = $target.offset().top;
            	$('html,body').animate({scrollTop: targetOffset}, 1000);
                return false;
            }
        }
    });
	$(window).scroll(function () { 
		var scrollTop = $(document).scrollTop();
		scrollTop = parseInt(scrollTop);
		var offset = topYloc+scrollTop+'px';  
		$('.top-link').animate({top:offset},{duration:500,queue:false});
	});
	topYloc = parseInt($('.top-link').css('top').substring(0,$('.top-link').css('top').indexOf('px')));
	
	
	
	// Initialize Masonry plugin, masonry.desandro.com
	var $tumblelog = $('.content');
	
	$tumblelog.imagesLoaded( function(){
	  $tumblelog.masonry({
	    isFitWidth: true
	  });
	});

});



$(window).scroll(function(){
	
	// Toggle back to top link on scroll
	if(window.pageYOffset >= 200){
		$('.top-link').fadeIn(600);
	}
	if(window.pageYOffset < 200){
		$('.top-link').fadeOut(185);
	}
	
});




/*
 * --------------------------------------------------------------------------------
 *	FUNCTIONS
 * --------------------------------------------------------------------------------
 */

// Display latest tweet
function recent_tweets(data) {
	for (i=0; i<1; i++) {
		var date = new Date(data[i].created_at);
		document.getElementById('tweets').innerHTML +=
			'<div class="tweet-content"><a href="http://twitter.com/miguelmota/status/'+
			+(data[i].id_str ? data[i].id_str : data[i].id)+'" rel="external">'+data[i].text+'</a> <time class="tweet-date">'+niceTime(data[i].created_at)+'</time></div>';
	}
	document.getElementById('tweet-wrap').style.display = 'block';
}
// Initialize latest tweet mtip
$('.mtip-tweet').mtip();
$('#tweet-wrap').live({
	mouseenter:
		function(){
			showMtip('.icon-twitter-bird-24', this);
	},
	mouseleave:
		function(){
		hideMtip('.icon-twitter-bird-24', this);
	}
});
$.getScript('http://miguelmota.tumblr.com/tweets.js');


// Initialize fancybox
function initializeFancybox() {
	
	// Fancybox options
	$('.fancybox').fancybox({
			'showCloseButton': false,
			'titlePosition': 'inside',
			'titleFormat': formatTitle,
			'padding': 0,
			'transitionIn': 'none',
			'transitionOut': 'none',
			'speedIn': 150, 
			'overlayColor': '#000',
			'overlayOpacity': .8
	});
	
	// Custom Fancybox caption formatting
	function formatTitle(title, currentArray, currentIndex, currentOpts) {
	    return '<div class="fancybox-title"><span><a class="button" href="javascript:void(0);" onclick="$.fancybox.close();">close X</a></span>' + (title && title.length ? '<strong>' + title + '</strong>' : '' ) + 'Image ' + (currentIndex + 1) + ' of ' + currentArray.length + '</div>';
	}
	
	
	
	// Show zoom icon on hover
	$('.fancybox').hover(function(){
			jQuery('.zoom-wrap', this).css('display', 'block');
	},function(){
			jQuery('.zoom-wrap', this).hide();
		  }
	);
	
}



// Convert UTC time to niceTime ie. 2 hours ago, james.padolsey.com/javascript/recursive-pretty-date
var niceTime = (function(){
	    var ints = {
	        second: 1,
	        minute: 60,
	        hour: 3600,
	        day: 86400,
	        week: 604800,
	        month: 2592000,
	        year: 31536000
	    };
	    return function(time){
	        time = +new Date(time);
	        var gap = ((+new Date()) - time) / 1000,
	            amount, measure;
	        for (var i in ints){
	            if (gap > ints[i]){ measure = i; }
	        }
	        amount = gap / ints[measure];
	        amount = gap > ints.day ? (Math.round(amount)) : Math.round(amount);
	        amount += ' ' + measure + (amount > 1 ? 's' : '') + ' ago';			    	  	 
	        return amount;
	    };
	})();



// Right scroll effect on navigation links
var position = 0;
var length = 'portfolio'.length;

function textTicker(){
	
	$('#tumblog').text('tumblog'.substring(0,position));
	$('#stream').text('stream'.substring(0,position));
	$('#about').text('about'.substring(0,position));
	$('#portfolio').text('portfolio'.substring(0,position));
	$('#contact').text('contact'.substring(0,position));
	$('#blog').text('blog'.substring(0,position));
	
	if(position++ == 8){
		setTimeout('textTicker()',1000);
	} 
	else{
		setTimeout('textTicker()',60);
	}
	
}



// Display the year
function displayYear(){
	var date = new Date();
	var thisYear = date.getFullYear();
	
	document.write(thisYear);
}



// Display pathanme
function displayURL(){
	document.write(pathname);
}



/* ------------------------
 * mtip functions
 * --------------------- */

// Show mtip on element mouseenter
function showMtip(element) {
	var link = element;
	$(link).trigger('mouseenter');
}

// Hide mtip on element mouseleave
function hideMtip(element) {
	var link = element;
	$(link).trigger('mouseleave');
}

// Show mtip and then hide after 3 seconds
function showMtipTimeout(element) {
	var link = element;
	$(link).trigger('mouseenter');
	setTimeout(function(){
		$(link).trigger('mouseleave');
	}, 3000);
}



/* --------------------------------------------------
 * Stream page functions
 * ----------------------------------------------- */
function streamPage(){
	
	// Hide stream logo text
	$(".stream-logo:not('.stream-logo-blog ,.stream-logo-latitude')").text('');
	showMtipTimeout('.stream-logo-blog');
	showMtipTimeout('.stream-logo-latitude');
	
	
	
	// Initialize mtip
	$('.mtip').mtip();

	
	
	/* ------------------------
	 * Twitter stream
	 * --------------------- */
	$('.stream-twitter .loader').css('display','block');
	$.getJSON('http://twitter.com/status/user_timeline/miguel_mota.json?callback=?', 
			{
				count: '5'
			},
			function(data){
				$.each(data, function(i, status){
					var htmlString = '<ul class="stream-ul stream-ul-twitter">';
					var post = status.text;
					var id = status.id_str;
		    	  	var date = new Date(status.created_at).toUTCString();
					htmlString += "<li id='"+id+"' class='status'><span class='post'><a href='http://twitter.com/miguel_mota/status/"+id+"' rel='external'><span class='icon icon-twitter-bird-16'></span> "+post+"</a></span> <time class='status-date'>"+niceTime(date)+"</time></li>";
					$('.stream-twitter').append(htmlString +'</ul>');
				});
				$('.stream-twitter .loader').css('display','none');
				showMtipTimeout('.stream-logo-twitter');
			}
	);
	
	
	
	/* ------------------------
	 * Facebook stream
	 * --------------------- */
	$('.stream-facebook .loader').css('display','block');
	$.getJSON('https://graph.facebook.com/miguel.mota2/feed?&callback=?', 
			{
				limit: '3'
			},
			function(json){
				$.each(json.data, function(i, fb){
					var post = fb.message;
					var post_id = fb.id.substr(16);
					var type = fb.type;
					var link = fb.link;
					var name = fb.name;
					var caption = fb.caption;
					var description = fb.description;
		    	  	var date = new Date(fb.created_time).toUTCString();		   
		    	  	switch(type){
		    	  	case 'status':
			    	    $('ul.facebook-status').append("<li class='status'>&#187; <span class='post'>"+post+"</span> <time class='status-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"' rel='external'>"+niceTime(date)+"</a></time></li>");
			    	    break;
		    	  	case 'link':
		    	  		if(post){
				    	    $('ul.facebook-status').append("<li class='status'>&#187; Link: <span class='post'>"+post+" <a href='"+link+"' rel='external'>"+name+"</a></span> <time class='status-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></time></li>");
		    	  		}
		    	  		else{
		    	  			$('ul.facebook-status').append("<li class='status'>&#187; Link: <a href='"+link+"' rel='external'>"+name+"</a></span> <time class='status-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></time></li>");
		    	  		}
			    	    break;
		    	  	case 'video':
		    	  		if(post){
		    	  			$('ul.facebook-status').append("<li class='status'>&#187; Video: <span class='post'>"+post+" <a href='"+link+"' rel='external'>"+name+"</a></span> <time class='status-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></time></li>");
		    	  		}
		    	  		else{
				    	    $('ul.facebook-status').append("<li class='status'>&#187; Video: <span class='post'><a href='"+link+"' rel='external'>"+name+"</a></span> <time class='status-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></time></li>");
		    	  		}
			    	    break;
		    	  	default:
		    	  		break;
		    	  	}
				});
				$('.stream-facebook .loader').html('<span style="color: #555;>"[fetch failed]</span>');
				showMtipTimeout('.social.facebook');
			}
	);
	
	
	
	/* ------------------------
	 * Tumblr stream
	 * --------------------- */
	$('.stream-tumblr .loader').css('display','block');
	$.getJSON('http://miguelmota.tumblr.com/api/read/json?num=3&callback=?',
			function(data){
				$.each(data.posts, function(i, posts){ 
						var htmlString = '<ul class="stream-ul stream-ul-tumblr">';
			    	  	var date = new Date(this['date-gmt']).toUTCString();
			    	  	var url = this.url;
			    	  	var type = this.type;
			    	  	var caption = this['photo-caption'];
			    	  	var slug = this.slug.replace(/-/g,' ');
			    	  	htmlString += "<li><a href='"+url+"' rel='external'><span class='icon icon-"+type+"-16'></span> "+slug.substring(0,1).toUpperCase()+slug.substr(1,200)+"</a> <time class='status-date'>"+niceTime(date)+"</time></li>";
						$('.stream-tumblr').append(htmlString +'</ul>');
			      }); 
				  $('.stream-tumblr .loader').css('display','none');
				  showMtipTimeout('.stream-logo-tumblr');
			  }
	);
	
	
	
	/* ------------------------
	 * Delicious stream
	 * --------------------- */
	$('.stream-delicious .loader').css('display','block');
	$.getJSON('http://feeds.delicious.com/v2/json/miguelmota?callback=?', 
			{
				count: '3'
			},
			function(data){
				$.each(data, function(i, item){
					var htmlString = '<ul class="stream-ul stream-ul-delicious">';
					var title = item.d;
					var url = item.u;
		    	  	var date = new Date(item.dt).toUTCString();
		    	  	htmlString += "<li><a href='"+url+"' rel='external'><span class='icon icon-link-16'></span> "+title+"</a> <time class='status-date'>"+niceTime(date)+"</time></li>";
					$('.stream-delicious').append(htmlString +'</ul>');
				});
				$('.stream-delicious .loader').css('display','none');
				showMtipTimeout('.stream-logo-delicious');
		}
	);
	
	
	
	/* ------------------------
	 * Last fm stream
	 * --------------------- */
	$('.stream-lastfm .loader').css('display','block');
	// All parameters in url: http://ws.audioscrobbler.com/2.0/?format=json&method=user.getRecentTracks&user=miguel_mota&api_key=dc0e875b6c0fd8ac4891b0716897e6c1&limit=5&callback=?
	$.getJSON('http://ws.audioscrobbler.com/2.0/?callback=?', 
			{
				format: 'json',
				method: 'user.getRecentTracks',
				user: 'miguel_mota',
				api_key: 'dc0e875b6c0fd8ac4891b0716897e6c1',
				limit: '5'
			},
			function(data){       
				$.each(data.recenttracks.track, function(i, item){ 
						var htmlString = '<ul class="stream-ul stream-ul-lastfm stream-ul-chart">';
						var url = item.url;
						var name = item.name;
						var artist = item.artist['#text'];
						var image = item.image[0]['#text'];
						var date =  item.date['#text'];
						htmlString += "<li><a href='"+url+"' rel='external'><img class='stream-thumb' src='"+image+"' alt='' /> "+artist+" - "+name+"</a> <time class='status-date'>"+date+"</time></li>";
						$('.stream-lastfm').append(htmlString +'</ul>');
				}); 
				$('.stream-lastfm .loader').css('display','none');
				showMtipTimeout('.stream-logo-lastfm');
			}
	);
	
	
	
	/* ------------------------
	 * Wakoopa stream
	 * --------------------- */
	$('.stream-wakoopa .loader').css('display','block');
	$.getJSON('http://api.wakoopa.com/miguelmota/recently_used.json?callback=?',
		{
			limit: '3'
		},
		function wakoopaApi(data){
			var html = ["<ul class='stream-ul stream-ul-wakoopa stream-ul-chart'>"];
			for(var i = 0; i < data.length; i++){
				var entry = data[i].software;
				var date = new Date(entry.last_active_at).toUTCString();
				html.push("<li><a href='"+entry.complete_url+"' rel='external'> <img class='stream-thumb' src='"+entry.complete_thumb_url+"' alt='' /> "+entry.name+"</a> <time class='status-date'>"+niceTime(date)+"</time>", "</li>");
			}
			html.push("</ul>");
			document.getElementById('stream-wakoopa-software').innerHTML = html.join("");
			$('.stream-wakoopa .loader').css('display','none');
			showMtipTimeout('.stream-logo-wakoopa');
		}
	);
		
		
	
	/* ------------------------
	 * Flickr stream
	 * --------------------- */
	$.getJSON('http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&jsoncallback=?',
		{
			format: 'json',
			api_key: '2a3074a0411f6d3649972787fcacea59',
			user_id: '40464790@N08',
		},
			function jsonFlickrFeed(data) {
				var htmlString = '<div class="stream-carousel-wrap"><a href="javascript:void(0);" class="stream-carousel-nav stream-carousel-nav-prev"><span class="stream-carousel-nav-inner">&#171;</span></a><div class="stream-carousel stream-carousel-flickr"><ul class="stream-ul stream-ul-flickr jcarousel-skin-tango">';
				$.each(data.photos.photo, function(i,item) {	
					
					var flickr_id = item.id;
					var flickr_farm = item.farm;
					var flickr_server = item.server;					
					var flickr_secret = item.secret;
					var flickr_title = item.title;
					
					//var thumbnail = (item.media.m);
					var flickr_thumbnail = "http://farm"+flickr_farm+".static.flickr.com/"+flickr_server+"/"+flickr_id+"_"+flickr_secret+"_m.jpg";
					//var thumbnail_small = (item.media.m).replace('_m.jpg','_s.jpg');
					//var photo = (item.media.m).replace('_m.jpg','_b.jpg');						
					var flickr_photo = "http://farm"+flickr_farm+".static.flickr.com/"+flickr_server+"/"+flickr_id+"_"+flickr_secret+"_b.jpg";


					htmlString += "<li><a class='fancybox' rel='flickr internal' href='"+flickr_photo+"' title='"+flickr_title+" ["+flickr_id+"]'><img src='"+flickr_thumbnail+"' alt='' /><span class='zoom-wrap zoom-wrap-flickr'><span class='icon icon-zoom-24 icon-zoom-flickr'></span></span></a></li>";
				});
				$('.stream-flickr .loader').css('display','none');
				$('.stream-flickr').append(htmlString +'</ul></div><a href="javascript:void(0);" class="stream-carousel-nav stream-carousel-nav-next"><span class="stream-carousel-nav-inner">&#187;</span></a></div>');
				showMtipTimeout('.stream-logo-flickr');
				
				$('.stream-carousel-flickr').jCarouselLite({
					 btnNext: '.stream-carousel-nav-next',
					 btnPrev: '.stream-carousel-nav-prev'
				});

			});
	
	
	
	// Show mtip on stream-wrap mouseenter
	$('.stream-wrap').live({
			mouseenter:
				function(){
					showMtip('.'+$(this).attr('class').split(' ')[1]+' .stream-logo');
			},
			mouseleave:
				function(){
				hideMtip('.'+$(this).attr('class').split(' ')[1]+' .stream-logo');
			}
	});
	
	
	
	// Initalize draggable on stream items
	$('.stream-wrap').draggable({
			cursor: 'move'
		});

}



/* --------------------------------------------------
 * Portfolio page functions
 * ----------------------------------------------- */
function portfolioPage(){
	
	// Project hover border glow effect
	$(".project .image-container").live({
		mouseenter:
			function(){
				// jQuery('.overlay', this).fadeOut(200);
				$(this).css({
					'-webkit-box-shadow': '0 0 10px #fff',
					'-moz-box-shadow': '0 0 10px #fff',
					'box-shadow': '0 0 10px #fff'
					});
		},
		mouseleave:
			function(){
				// jQuery('.overlay', this).hide().fadeIn(300);
				$(this).css({
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
				jQuery('.overlay-popup', this).animate({bottom: '0'}, {queue: false, duration: 150});
		},
		mouseleave:
			function(){
				jQuery('.overlay-popup', this).animate({bottom: '-100px'}, {queue: false, duration: 125});
		}
	});
	
	
	
	/* ------------------------
	 * Project sort functions
	 * --------------------- */
	
	// Show all work
	$('.project-sort-all').live('click', function(){
		$('.project-sort-wrap a').removeClass('selected');
		$(this).addClass('selected');
		$('.project').slideDown('fast');
	});

	// Show web work
	$('.project-sort-web').live('click', function(){
		$('.project-sort-wrap a').removeClass('selected');
		$(this).addClass('selected');
		$(".project:not('.project-web')").slideUp('fast');
		$('.project-web').slideDown('fast');
	});
	
	// Show logo work
	$('.project-sort-identity').live('click', function(){
		$('.project-sort-wrap a').removeClass('selected');
		$(this).addClass('selected');
		$(".project:not('.project-identity')").slideUp('fast');
		$('.project-identity').slideDown('fast');
	});
	
	// Show code work
	$('.project-sort-code').live('click', function(){
		$('.project-sort-wrap a').removeClass('selected');
		$(this).addClass('selected');
		$(".project:not('.project-code')").slideUp('fast');
		$('.project-code').slideDown('fast');
	});
	
}



/* --------------------------------------------------
 * Contact page functions
 * ----------------------------------------------- */
function contactPage(){
	
	// Create method to validate name input
	$('.contact-form-submit').live('click', function(){
		$.validator.addMethod('namecheck', function(value, element){
			return this.optional(element) || /^[a-zA-Z]*$/.test(value);
	});

		
		
	// Validate contact form
	$('.contact-form').validate({
		rules: {
			name: {
				namecheck: true,
				required: true
			},
			email: {
				required: true,
				email: true
			},
			message: {
				required: true,
				minlength: 2
			}
		},
		messages: {
			name: {
				namecheck: '',
				required: ''
			},
			email: {
				required: '',
				email: ''
			},
			message: '',
			minlength: ''
			},
		onkeyup: true,
		debug: true
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

	
}



/* --------------------------------------------------
 * Blog page functions
 * ----------------------------------------------- */
function blogPage(){
	
	// Get AddThis script
	$.getScript('http://s7.addthis.com/js/250/addthis_widget.js#username=miguelmota');
	
	// Get Twitter widgets script
	$.getScript('http://platform.twitter.com/widgets.js');

	// Initialize Tumblr share button
	/*
	$.getScript('http://platform.tumblr.com/v1/share.js');
	var tumblr_link_url = document.getElementById('post-link').getAttribute('href');
	var tumblr_link_name = document.getElementById('post-link').innerText;
	var tumblr_link_description = document.getElementById('post-content').innerText;
    var tumblr_button = document.getElementById('tumblr-share-button');
    tumblr_button.setAttribute('href', 'http://www.tumblr.com/share/link?url='+encodeURIComponent(tumblr_link_url)+'&name='+encodeURIComponent(tumblr_link_name)+'&description='+encodeURIComponent(tumblr_link_description));
    tumblr_button.setAttribute('title', tumblr_link_name);
    tumblr_button.setAttribute('style', "display:inline-block; text-indent:-9999px; overflow:hidden; width:81px; height:20px; background:url('http://platform.tumblr.com/v1/share_1.png') top left no-repeat transparent;");
    */
	
    
	// Highlight and select short url on focus
	$('.short-url').focus(function(){
		$(this).select();
	});
	$('.short-url').mouseup(function(e){
        e.preventDefault();
	});

}

/*
 * --------------------------------------------------------------------------------
 *	END FUNCTIONS
 * --------------------------------------------------------------------------------
 */











/*
 * --------------------------------------------------------------------------------
 *	OLD STUFF
 * --------------------------------------------------------------------------------
 */
//ajax load page
/*
$("ul.main-nav a:not('.nav-logo, #blog')").live('click', function(){
		if(typeof(window.history.pushState) == 'function' && screen.width > 640){
			c = 0;
			bc = 0;
			ldc = 0;
			var loadSubTitle = $(this).attr('href')+' span.sub';
			var toLoad = $(this).attr('href')+' section.content';
			$('h1.title span.sub').fadeOut('fast');
			$('section.content').fadeOut('fast',loadContent);
			$('div.loader-container').fadeIn('normal');
			function loadContent(){
				$('h1.title span.sub').load(loadSubTitle);
				$('section.content').load(toLoad,showNewContent);
			}
			if(typeof(window.history.pushState) == 'function'){
				var stateObj = { foo:  $(this).attr('href') };
				history.pushState(stateObj, "Title", $(this).attr('href'));
			}
			else{
				window.location.hash = '!'+$(this).attr('href').substr(1,$(this).attr('href').length);
			}
			return false;
		}
		else{
			return true;
		}
});


function showNewContent(){
	
	if(typeof(window.history.pushState) != 'function'){
		//$('#'+window.location.hash.substr(2)).addClass('selected');
	}
	$('h1.title span.sub').show();
	$('section.content, footer.main').fadeIn('normal',hideLoader);
	
}

function hideLoader(){
	
	$('div.loader-container').hide();
	
}
*/
