$(document).ready(function(){
	
	// Set IE notice cookie
	if($.cookie('ieNotice') == null) {
		$.cookie('ieNotice', '1', {
				expires: 7,
				path: '/'
			}
		);
	}
	
	// If cookie active show IE notice
	if($.cookie('ieNotice') == '1') {
		setTimeout(function(){
			$('.ie-notice-wrap').fadeIn('slow');
		}, 2000);
	}
	else {
		// Else hide IE notice
		$('.ie-notice-wrap').css('display','none');
	}
	
	// Hide IE notice and change IE cookie on close button click
	$('.ie-notice-close').live('click', function(){
		$('.ie-notice-wrap').fadeOut('slow');
		$.cookie('ieNotice','0');
	});

	
	
	// Initialize side nav text ticker; NOTE: might cause bug in Firefox
	textTickerSelected();
	


	// Add selected class to nav link based on page content class name
	$('.main-side-nav-ul a').each(function(){ 
		if($(this).attr('id') == $('.content').attr('class').split(' ')[1]){
			$('#stream').removeClass('selected');
			$(this).addClass('selected');
			$('.icon', this).addClass('icon-no-opacity');
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
	


	// Highlight icon on link hover
	$('a:not(".selected, .blog-post-list a")').has('.icon').hover(
		function(){
			$('.icon', this).addClass('icon-no-opacity');
		},
		function(){
			$('.icon', this).removeClass('icon-no-opacity');
		}
	);
	


	// Navigation hover effect
	$('.main-side-nav-ul a:not(".selected")').hover(
			function(){
				$(this).animate({borderLeftWidth: '6px'}, {queue: false, duration: 60});
			},
			function(){
				$(this).animate({borderLeftWidth: '4px'}, {queue: false, duration: 60});
			}
		);
	
	
	
	// Change default text color on input focus
	$('input:text:not(".short-url"), input:password, textarea').focus(function(){
		if(this.value === this.defaultValue){
			this.value = '';
		}
		$(this).css({
			color: '#999',
			fontStyle: 'normal'
		});
	}).blur(function(){
		if(this.value === ''){
			this.value = this.defaultValue;
			$(this).css({
			color: '#555',
			fontStyle: 'italic'
		});
		}
	});

	
	
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



	// Zebra stripe every other list item
	$('.stream-ul li:odd').css({
		'background-color': '#141414'	
	});

	
	
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
	

	// Initialize mtip on social icons
	$('.icon-social').mtip();



	// Initialize about page map
	if($('.content').attr('class').split(' ')[1] == 'about'){
		initializeAboutMap();
	}
	
});

var fixed = false;
$(window).scroll(function(){
	
	// Main side nav scroll to fixed
	if(window.innerWidth >= 769) {
		
		if($(this).scrollTop() >= 50){
			if(!fixed){
				fixed = true;
				$('.main-side-nav').css({
					position: 'fixed'
				});
			}
		}
		else {
			if(fixed){
				fixed = false;
				$('.main-side-nav').css({
					position: 'static'
				});
			}
		}
		
	}
	
	
	
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
 *	GLOBAL FUNCTIONS
 * --------------------------------------------------------------------------------
 */

// Convert date to ISO string
function ISODateString(d){
	function pad(n){return n<10 ? '0'+n : n}
	return d.getUTCFullYear()+'-'
	      + pad(d.getUTCMonth()+1)+'-'
	      + pad(d.getUTCDate())+'T'
	      + pad(d.getUTCHours())+':'
	      + pad(d.getUTCMinutes())+':'
	      + pad(d.getUTCSeconds())+'Z'
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



// Relative time function, http://stackoverflow.com/questions/7516548/how-to-convert-date-and-time-to-timeago-format-in-jquery
function relative_time(date_str) {
    if (!date_str) {return;}
    date_str = $.trim(date_str);
    date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
    date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
    date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
    var parsed_date = new Date(date_str);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
    var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
    delta=(delta<2)?2:delta;
    var r = '';
    if (delta < 60) {
    r = delta + ' seconds ago';
    } else if(delta < 120) {
    r = 'a minute ago';
    } else if(delta < (45*60)) {
    r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
    } else if(delta < (2*60*60)) {
    r = 'an hour ago';
    } else if(delta < (24*60*60)) {
    r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
    } else if(delta < (48*60*60)) {
    r = 'a day ago';
    } else {
    r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
    }
    return 'about ' + r;
};



// format date function
function formattedDate(d) {
  	var date = new Date(d);
  	var day_week = date.getDay();
  	var day_week_array = {1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat', 7:'Sun'};
  	day_week = day_week_array[day_week];
  	if(!day_week) { day_week = ""; }
  	var day = date.getDate();
  	if(!day) { day = ""; }
  	// var month = date.getMonth();
	var month = date.toString().substr(3,4);
  	var year = date.getYear();
  	if (!year) { year = ""; }
  	var minutes = date.getMinutes();
  	if (!minutes) { minutes = ""; }
  	var hour = date.getHours();
  	var meridiem = (hour < 12) ? "AM" : "PM";
  	if (hour == 0) {
	  	hour = 12;
	}
	if (hour > 12) {
    	hour -= 12;
    }
    if (!hour) { hour = ""; }
    if (!meridiem) { meridiem = ""; }
    var formatted_date = "";
    if(day != "") {
  		formatted_date = day_week+' '+month+', '+day+' '+hour+':'+minutes+' '+meridiem;
  	}

  	return formatted_date;

}



// Display latest tweet
function recent_tweets(data) {
	for (i=0; i<1; i++) {
		var date = data[i].created_at;
		document.getElementById('latest-tweet').innerHTML =
		'<a class="latest-tweet-content" href="http://twitter.com/miguel_mota/status/'+data[i].id_str+'" rel="external">'+data[i].text+' <time class="latest-tweet-date" datetime="">'+formattedDate(date)+'</time></a>';
		
		// Initialize timeago
		// $('.latest-tweet-date').timeago();
	}
	
	// Show mtip on twitter bird hover
	$('#latest-tweet-wrap').live({
		mouseenter:
			function(){
				showMtip('.icon-twitter-bird-24', this);
		},
		mouseleave:
			function(){
				hideMtip('.icon-twitter-bird-24', this);
		}
	});
}
$.getScript('https://twitter.com/statuses/user_timeline/miguel_mota.json?callback=recent_tweets&count=5');



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

	

	// Fancybox iframe options
	$('.fancybox-iframe').fancybox({
		'height': 500,
		'width': 500,
		'type': 'iframe',
		'autoScale': 'false',
		'showCloseButton': false,
		'titlePosition': 'inside',
		'titleFormat': formatIframeTitle,
		'padding': 0,
		'transitionIn': 'none',
		'transitionOut': 'none',
		'speedIn': 150, 
		'overlayColor': '#000',
		'overlayOpacity': 0
	});
	
	
	
	// Custom Fancybox caption formatting
	function formatTitle(title, currentArray, currentIndex, currentOpts) {
	    return '<div class="fancybox-title"><span><a class="button" href="javascript:void(0)" onclick="$.fancybox.close();">close X</a></span>' + (title && title.length ? '<strong>' + title + '</strong>' : '' ) + 'Image ' + (currentIndex + 1) + ' of ' + currentArray.length + '<div class="clear"></div></div>';
	}
	
	
	
	// Custom Fancybox iframe caption formatting
	function formatIframeTitle(title, currentArray, currentIndex, currentOpts) {
	    return '<div class="fancybox-title fancybox-title-iframe"><span><a class="button" href="javascript:void(0)" onclick="$.fancybox.close();">close X</a></span><span class="title-wrap">' + (title && title.length ? '<strong>' + title + '</strong>' : '' ) + '</span><div class="clear"></div></div>';
	}
	
	
	
	// Show zoom icon on hover
	$('.fancybox').hover(function(){
			jQuery('.zoom-wrap', this).css('display', 'block');
	},function(){
			jQuery('.zoom-wrap', this).hide();
		  }
	);
	
}



// Right scroll effect on navigation links
var position = 0;

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

// textTicker on selected nav link
function textTickerSelected(){

	$('#'+$('.content').attr('class').split(' ')[1]+' .page').text($('.content').attr('class').split(' ')[1].substring(0,position));

	if(position++ == 1){
		setTimeout('textTickerSelected()',30);
	} 
	else{
		setTimeout('textTickerSelected()',30);
	}
	
}



// Display the year
function displayYear(){
	var date = new Date();
	var thisYear = date.getFullYear();
	
	document.write(thisYear);
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
function showMtipTimeout(element,delay) {
	var link = element;
	var time = delay;
	$(link).trigger('mouseenter');
	setTimeout(function(){
		$(link).trigger('mouseleave');
	}, time);
}

// Show map button mtip
function mapButtonMtip(){
	showMtipTimeout('.latitude-map-button .mtip',3000);
}

/* --------------------------------------------------
 * Stream page functions
 * ----------------------------------------------- */

// Initialize Masonry plugin, masonry.desandro.com
function loadMasonry(){

	var $tumblelog = $('.content');
	
	if(window.width <= 640){
		$tumblelog = '';
	}
	
	$tumblelog.imagesLoaded( function(){
	  $tumblelog.masonry({
	    isFitWidth: true
	  });
	});
}



/* ------------------------
 * Wakoopa stream recent software
 * --------------------- */
function loadWakoopaRecent() {
	
	$('#stream-wakoopa-software-recent').html('');
	$('.stream-ul-wakoopa-recent').remove();
	$('.stream-ul-wakoopa-top').remove();
	$('.stream-wakoopa .loader').css('display','block');
	
	$.getJSON('http://api.wakoopa.com/miguelmota/recently_used.json?callback=?',
		{
			limit: '3'
		},
		function wakoopaApi(data){
			var html = ["<ul class='stream-ul stream-ul-wakoopa-recent'>"];
			for(var i = 0; i < data.length; i++){
				var entry = data[i].software;
				var date = entry.last_active_at;
				html.push("<li><a href='"+entry.complete_url+"' rel='external'><img class='stream-thumb' src='"+entry.complete_thumb_url+"' alt='' /> "+entry.name+" <time class='status-date' datetime=''>"+formattedDate(date)+"</time><span class='clear'></span></a></li>");
			}
			
			html.push("</ul>");
			document.getElementById('stream-wakoopa-software-recent').innerHTML = html.join("");
				
			$('.stream-ul-wakoopa-recent li:nth-child(odd)').addClass('odd');

			// Initialize timeago
			// $('.stream-ul-wakoopa-recent .status-date').timeago();

			$('.stream-wakoopa .loader').css('display','none');
			showMtipTimeout('.stream-logo-wakoopa',3000);
		}
	);
	
}
	
	

/* ------------------------
 * Wakoopa stream top software
 * --------------------- */
function loadWakoopaTop() {
	
	$('#stream-wakoopa-software-top').html('');
	$('.stream-ul-wakoopa-top').remove();
	$('.stream-ul-wakoopa-recent').remove();
	$('.stream-wakoopa .loader').css('display','block');
	
	$.getJSON('http://api.wakoopa.com/miguelmota/most_used.json?callback=?',
		{
			limit: '3'
		},
		function wakoopaApi(data){
			var html = ["<ul class='stream-ul stream-ul-wakoopa-top'>"];
			var rank = 1;
			for(var i = 0; i < data.length; i++){
				var entry = data[i].software;
				var date = entry.last_active_at;
				html.push("<li><a href='"+entry.complete_url+"' rel='external'><span class='rank-number'>"+rank+"</span> <img class='stream-thumb' src='"+entry.complete_thumb_url+"' alt='' /> "+entry.name+" <time class='status-date' datetime=''>"+formattedDate(date)+"</time><span class='clear'></span></a></li>");
				rank++;
			}
			
			html.push("</ul>");
			document.getElementById('stream-wakoopa-software-top').innerHTML = html.join("");
			$('.stream-ul-wakoopa-top li:nth-child(odd)').addClass('odd');

			// Initialize timeago
			// $('.stream-ul-wakoopa-top .status-date').timeago();
			
			$('.stream-wakoopa .loader').css('display','none');
		}
	);
	
}



// Show wakoopa software recent
function streamSortWakoopaRecent(){
	loadWakoopaRecent();
	$('.stream-sort-wakoopa a').removeClass('selected');
	$('.stream-sort-wakoopa-recent').addClass('selected');
	$(".stream-ul-wakoopa:not('.stream-ul-wakoopa-recent')").slideUp('fast');
	$('.stream-ul-wakoopa-recent').slideDown('fast');
	$.cookie('streamSortWakoopa', 'recent');
}

// Show wakoopa software top
function streamSortWakoopaTop(){
	loadWakoopaTop();
	$('.stream-sort-wakoopa a').removeClass('selected');
	$('.stream-sort-wakoopa-top').addClass('selected');
	$(".stream-ul-wakoopa:not('.stream-ul-wakoopa-top')").slideUp('fast');
	$('.stream-ul-wakoopa-top').slideDown('fast');
	$.cookie('streamSortWakoopa', 'top');
}



/* ------------------------
 * Last.fm stream recent tracks
 * --------------------- */
function loadLastfmRecent(){
	
	$('.stream-ul-lastfm').remove();
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
				$('.stream-lastfm').append('<ul class="stream-ul stream-ul-lastfm stream-ul-lastfm-recent">');    
				$.each(data.recenttracks.track, function(i, item){ 
						var url = item.url;
						var name = item.name;
						var artist = item.artist['#text'];
						var image = '/assets/site/logo-16.png';
						if (item.image[0]['#text']) {
							image = item.image[0]['#text'];
						}
						var date =  item.date['#text'];
						var list_item = "<li><a href='"+url+"' rel='external'><img class='stream-thumb' src='"+image+"' alt='' /> "+artist+" - "+name+" <time class='status-date' datetime='' style='color:#999 !important;font-size:12px !important;font-weight:normal !important;float:right !important;'>"+formattedDate(date)+"</time><span class='clear'></span></a></li>";
						$('.stream-ul-lastfm-recent').append(list_item);
				}); 
				
				$('.stream-ul-lastfm-recent').append('</ul>');
				$('.stream-ul-lastfm-recent li:nth-child(odd)').addClass('odd');

				// Initialize timeago
				// $('.stream-ul-lastfm-recent .status-date').timeago();

				$('.stream-lastfm .loader').css('display','none');
				showMtipTimeout('.stream-logo-lastfm',3000);
			}
	);

}



/* ------------------------
 * Last.fm stream loved tracks
 * --------------------- */
function loadLastfmLoved(){
	
	$('.stream-ul-lastfm').remove();
	$('.stream-lastfm .loader').css('display','block');
	
	// All parameters in url: http://ws.audioscrobbler.com/2.0/?format=json&method=user.getLovedTracks&user=miguel_mota&api_key=dc0e875b6c0fd8ac4891b0716897e6c1&limit=5&callback=?
	$.getJSON('http://ws.audioscrobbler.com/2.0/?callback=?', 
			{
				format: 'json',
				method: 'user.getLovedTracks',
				user: 'miguel_mota',
				api_key: 'dc0e875b6c0fd8ac4891b0716897e6c1',
				limit: '5'
			},
			function(data){       
				$('.stream-lastfm').append('<ul class="stream-ul stream-ul-lastfm stream-ul-lastfm-loved">');    
				$.each(data.lovedtracks.track, function(i, item){ 
						var url = item.url;
						var name = item.name;
						var artist = item.artist['name'];
						var image = item.image[0]['#text'];
						var date =  item.date['#text'];
						var list_item = "<li><a href='"+url+"' rel='external'><span class='icon icon-heart-red-16 icon-heart-lastfm'></span> <img class='stream-thumb' src='"+image+"' alt='' /> "+artist+" - "+name+" <time class='status-date' datetime='' style='color:#999 !important;font-size:12px !important;font-weight:normal !important;float:right !important;'>"+formattedDate(date)+"</time><span class='clear'></span></a></li>";
						$('.stream-ul-lastfm-loved').append(list_item);
				}); 

				$('.stream-ul-lastfm-loved').append('</ul>');
				$('.stream-ul-lastfm-loved li:nth-child(odd)').addClass('odd');

				// Initialize timeago
				// $('.stream-ul-lastfm .status-date').timeago();

				$('.stream-lastfm .loader').css('display','none');
			}
	);
	
}



/* ------------------------
 * Last.fm stream top tracks
 * --------------------- */
function loadLastfmTop(){
	
	$('.stream-ul-lastfm').remove();
	$('.stream-lastfm .loader').css('display','block');
	
	// All parameters in url: http://ws.audioscrobbler.com/2.0/?format=json&method=user.getTopTracks&user=miguel_mota&api_key=dc0e875b6c0fd8ac4891b0716897e6c1&limit=5&callback=?
	$.getJSON('http://ws.audioscrobbler.com/2.0/?callback=?', 
			{
				format: 'json',
				method: 'user.getTopTracks',
				user: 'miguel_mota',
				api_key: 'dc0e875b6c0fd8ac4891b0716897e6c1',
				limit: '5'
			},
			function(data){  
				var rank = 1;     
				
				$('.stream-lastfm').append('<ul class="stream-ul stream-ul-lastfm stream-ul-lastfm-top">');
				$.each(data.toptracks.track, function(i, item){ 
						var url = item.url;
						var name = item.name;
						var artist = item.artist['name'];
						var image = '/assets/site/logo-16.png';
						var playcount =  item.playcount;
						var list_item = "<li><a href='"+url+"' rel='external'><span class='rank-number'>"+rank+"</span> <img class='stream-thumb' src='"+image+"' alt='' /> "+artist+" - "+name+" <time class='status-date' style='color:#999 !important;font-size:12px !important;font-weight:normal !important;float:right !important;'>"+playcount+" plays</time><span class='clear'></span></a></li>";
						$('.stream-ul-lastfm-top').append(list_item);
						rank++;
				}); 
				
				$('.stream-ul-lastfm-top').append('</ul>');
				$('.stream-ul-lastfm-top li:nth-child(odd)').addClass('odd');

				$('.stream-lastfm .loader').css('display','none');
				//$('.stream-ul-lastfm-top').css('display','none');
			}
	);
	
}



// Show last.fm recent tracks
function streamSortLastfmRecent(){
	loadLastfmRecent();
	$('.stream-sort-lastfm a').removeClass('selected');
	$('.stream-sort-lastfm-recent').addClass('selected');
	$(".stream-ul-lastfm:not('.stream-ul-lastfm-recent')").slideUp('fast');
	$('.stream-ul-lastfm-recent').slideDown('fast');
	$.cookie('streamSortLastfm', 'recent');
}

// Show last.fm loved
function streamSortLastfmLoved(){
	loadLastfmLoved();
	$('.stream-sort-lastfm a').removeClass('selected');
	$('.stream-sort-lastfm-loved').addClass('selected');
	$(".stream-ul-lastfm:not('.stream-ul-lastfm-loved')").slideUp('fast');
	$('.stream-ul-lastfm-loved').slideDown('fast');
	$.cookie('streamSortLastfm', 'loved');
}

// Show last.fm top tracks
function streamSortLastfmTop(){
	loadLastfmTop();
	$('.stream-sort-lastfm a').removeClass('selected');
	$('.stream-sort-lastfm-top').addClass('selected');
	$(".stream-ul-lastfm:not('.stream-ul-lastfm-top')").slideUp('fast');
	$('.stream-ul-lastfm-top').slideDown('fast');
	$.cookie('streamSortLastfm', 'top');
}



function streamPositionReset(){

	$.cookie('streamLatitudeX',null);
	$.cookie('streamLatitudeY',null);
	$.cookie('streamBlogX',null);
	$.cookie('streamBlogY',null);
	$.cookie('streamTwitterX',null);
	$.cookie('streamTwitterY',null);
	$.cookie('streamFacebookX',null);
	$.cookie('streamFacebookY',null);
	$.cookie('streamTumblrX',null);
	$.cookie('streamTumblrY',null);
	$.cookie('streamDeliciousX',null);
	$.cookie('streamDeliciousY',null);
	$.cookie('streamLastfmX',null);
	$.cookie('streamLastfmY',null);
	$.cookie('streamWakoopaX',null);
	$.cookie('streamWakoopaY',null);
	$.cookie('streamFlickrX',null);
	$.cookie('streamFlickrY',null);

	loadMasonry();

	$('.stream-position-reset-wrap').css('display', 'none');
}
	
// rotate carousel
function rotate() {
	$('.stream-carousel-nav-next').click();
}


function streamPage(){


    /* ------------------------
	 * Stream Carousel
	 * --------------------- */
	var speed = 5000;
	var run = setInterval('rotate()', speed);
	var item_width = $('.stream-carousel-ul li').outerWidth();
	var left_value = item_width * (-1);
	$('.stream-carousel-ul li:first').before($('.stream-carousel-ul li:last'));
	$('.stream-carousel-ul').css({'left':left_value});
	$('.stream-carousel-nav-next').live('click', function(){
		var left_indent = parseInt($('.stream-carousel-ul').css('left')) - item_width;
		$('.stream-carousel-ul').animate({'left':left_indent}, 200, function(){
			$('.stream-carousel-ul li:last').after($('.stream-carousel-ul li:first'));
			$('.stream-carousel-ul').css({'left':left_value});
		});
		return false;
	});
	$('.stream-carousel-nav-prev').live('click', function(){
		var left_indent = parseInt($('.stream-carousel-ul').css('left')) + item_width;
		$('.stream-carousel-ul').animate({'left':left_indent}, 200, function(){
			$('.stream-carousel-ul li:first').before($('.stream-carousel-ul li:last'));
			$('.stream-carousel-ul').css({'left':left_value});
		});
		return false;
	});
	$('.stream-carousel-wrap').live({
			mouseenter:
				function(){
					clearInterval(run);
				},
			mouseleave:
				function(){
					run = setInterval('rotate()', speed);
				}
		});

	

	// Set wakoopa stream cookie
	if($.cookie('streamSortWakoopa') == null) {
		$.cookie('streamSortWakoopa', 'recent', {
				expires: 7,
				path: '/'
			}
		);
	}
	
	// Sort wakoopa stream based on cookie
	if ($.cookie('streamSortWakoopa') == 'recent') {
		streamSortWakoopaRecent();
	}
	else if ($.cookie('streamSortWakoopa') == 'top') {
		streamSortWakoopaTop();
	}
	else {
		$.cookie('streamSortWakoopa', 'recent');
	}



	// Set lastfm stream cookie
	if($.cookie('streamSortLastfm') == null) {
		$.cookie('streamSortLastfm', 'recent', {
				expires: 7,
				path: '/'
			}
		);
	}
	// Sort Lastfm stream based on cookie
	if ($.cookie('streamSortLastfm') == 'recent') {
		streamSortLastfmRecent();
	}
	else if ($.cookie('streamSortLastfm') == 'loved') {
		streamSortLastfmLoved();
	}
	else if ($.cookie('streamSortLastfm') == 'top') {
		streamSortLastfmTop();
	}
	else {
		$.cookie('streamSortLastfm', 'recent');
	}


	// Initialize mtip
	$('.mtip').mtip();


	// Hide stream logo text
	$(".stream-logo:not('.stream-logo-blog ,.stream-logo-latitude')").text('');
	showMtipTimeout('.stream-logo-blog',3000);
	showMtipTimeout('.stream-logo-latitude',3000);
	setTimeout('mapButtonMtip()', 1500);


	// Initialize timeago
	// $('.stream-ul-blog .status-date').timeago();
	
	
	
	/* ------------------------
	 * Latitude stream
	 * --------------------- */
	/*
	$('.stream-latitude2 .loader').css('display','block');
	$.getJSON('http://www.google.com/latitude/apps/badge/api?user=7812482200199007583&type=json&callback=?', 
			//{
				//count: '3'
			//},
			function(data){
		alert(data.properties);
				$.each(data.properties, function(i, item){
					
					var htmlString = '<ul class="stream-ul stream-ul-latitude2">';
					var url = 'http://www.google.com/latitude/apps/badge/api?user=7812482200199007583&type=iframe&maptype=roadmap';
					var location = this.reverseGeocode;
		    	  	//var date = new Date(item.features[0].properties.timeStamp).toUTCString();
		    	  	htmlString += "<li><a href='"+url+"' rel='external'><span class='icon icon-link-16'></span> "+location+"</a> <time class='status-date'>"+"1"+"</time></li>";
					$('.stream-latitude2').append(htmlString +'</ul>');
				});
				
				$('.stream-latitude2 .loader').css('display','none');
				showMtipTimeout('.stream-logo-latitude');
		}
	);
	*/
	
	
	
	/* ------------------------
	 * Twitter stream
	 * --------------------- */
	$('.stream-twitter .loader').css('display','block');
	$.getJSON('http://twitter.com/status/user_timeline/miguel_mota.json?callback=?', 
			{
				count: '5'
			},
			function(data){
				var pro_img_cnt = 0;
				$('.stream-twitter').append('<ul class="stream-ul stream-ul-twitter">');
				$.each(data, function(i, status){
					var htmlString = '<ul class="stream-ul stream-ul-twitter">';
					var profile_image = status.user.profile_image_url;
					var username = status.user.screen_name;
					var post = status.text;
					var id = status.id_str;
		    	  	var date = status.created_at;
					var list_item = "<li id='"+id+"' class='status'><a href='http://twitter.com/miguel_mota/status/"+id+"' rel='external'><span class='icon icon-twitter-bird-16'></span> "+post+" <time class='status-date' datetime='' style='color:#999 !important;font-size:12px !important;font-weight:normal !important;float:right !important;'>"+formattedDate(date)+"</time><span class='clear'></span></a></li>";
					$('.stream-ul-twitter').append(list_item);
					while(pro_img_cnt == 0){
						$('.stream-twitter').prepend('<a href="http://twitter.com/'+username+'"><img class="stream-profile-image" src="'+profile_image+'" alt="" /></a>');
						pro_img_cnt ++;
					}
				});

				$('.stream-ul-twitter').append('</ul>');
				$('.stream-ul-twitter li:nth-child(odd)').addClass('odd');

				// Initialize timeago
				// $('.stream-ul-twitter .status-date').timeago();

				$('.stream-twitter .loader').css('display','none');
				showMtipTimeout('.stream-logo-twitter',3000);
			}
	);
	
	
	
	/* ------------------------
	 * Facebook stream
	 * --------------------- */
	$('.stream-facebook .loader').css('display','block');
	/*
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
				    	    $('ul.facebook-status').append("<li class='status'>&#187; Link: <span class='post'>"+post+" <a href='"+link+"' rel='external'>"+name+"</a></span> <time class='status-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></time><div class='clear'></div></li>");
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
	*/
	
	
	
	/* ------------------------
	 * Tumblr stream
	 * --------------------- */
	$('.stream-tumblr .loader').css('display','block');
	$.getJSON('http://miguelmota.tumblr.com/api/read/json?num=3&callback=?',
			function(data){
				$('.stream-tumblr').append('<ul class="stream-ul stream-ul-tumblr">');
				$.each(data.posts, function(i, posts){ 
						
						var date = this['date-gmt'];

			    	  	var url = this.url;
			    	  	var type = this.type;
			    	  	if (type == 'answer') {
			    	  		type = 'question';
			    	  	}
			    	  	var caption = this['photo-caption'];
			    	  	var slug = this.slug.replace(/-/g,' ');
			    	  	var list_item = "<li><a href='"+url+"' rel='external'><span class='icon icon-"+type+"-16'></span> "+slug.substring(0,1).toUpperCase()+slug.substr(1,200)+" <time class='status-date' datetime=''>"+formattedDate(date)+"</time><span class='clear'></span></a></li>";
			    		$('.stream-ul-tumblr').append(list_item);
				}); 

				$('.stream-ul-tumblr').append('</ul>');
				$('.stream-ul-tumblr li:nth-child(odd)').addClass('odd');

				// Initialize timeago
				// $('.stream-ul-tumblr .status-date').timeago();

				$('.stream-tumblr .loader').css('display','none');
				showMtipTimeout('.stream-logo-tumblr',3000);
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
				$('.stream-delicious').append('<ul class="stream-ul stream-ul-delicious">');
				$.each(data, function(i, item){
					var title = item.d;
					var url = item.u;
		    	  	var date = item.dt;
		    	  	var list_item = "<li><a href='"+url+"' rel='external'><span class='icon icon-link-16'></span> "+title+" <time class='status-date' datetime=''>"+formattedDate(date)+"</time><span class='clear'></span></a></li>";
					$('.stream-ul-delicious').append(list_item);
				});
					
				$('.stream-ul-delicious').append('</ul>');
				$('.stream-ul-delicious li:nth-child(odd)').addClass('odd');

				// Initialize timeago
				// $('.stream-ul-delicious .status-date').timeago();
				
				$('.stream-delicious .loader').css('display','none');
				showMtipTimeout('.stream-logo-delicious',3000);
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
			per_page: 25
		},
		function jsonFlickrFeed(data) {
			var htmlString = '<div class="stream-carousel-wrap"><a href="javascript:void(0)" class="stream-carousel-nav stream-carousel-nav-prev"><span class="stream-carousel-nav-inner">&#171;</span></a><div class="stream-carousel stream-carousel-flickr"><ul class="stream-ul stream-ul-flickr stream-carousel-ul">';
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


				htmlString += "<li><a class='fancybox' rel='flickr' href='"+flickr_photo+"' title='"+flickr_title+" ["+flickr_id+"]'><img src='"+flickr_thumbnail+"' alt='' /><span class='zoom-wrap zoom-wrap-flickr'><span class='icon icon-zoom-24 icon-zoom-flickr'></span></span></a></li>";
			});
			
			
			$('.stream-flickr .loader').css('display','none');
			$('.stream-flickr').append(htmlString +'</ul><div class="clear"></div></div><a href="javascript:void(0)" class="stream-carousel-nav stream-carousel-nav-next"><span class="stream-carousel-nav-inner">&#187;</span></a></div><div class="clear"></div>');
			showMtipTimeout('.stream-logo-flickr',3000);
			


			// Draggable cursor
			$('.stream-wrap').draggable({
				containment: '.content',
				cursor: 'move'
			});
			
			
			
			/* ------------------------
			 *  jQuery Draggable cookies to remember location
			 * --------------------- */
			// Latitude stream cookie
			$('.stream-latitude').css({
				top: $.cookie('streamLatitudeY')*1,
				left: $.cookie('streamLatitudeX')*1
			}).draggable({
				stop: function(event, ui) {
					$.cookie('streamLatitudeX',ui.position.left);
					$.cookie('streamLatitudeY',ui.position.top);
					$('.stream-position-reset-wrap').css('display', 'block');
				}
			});
			
			// Blog stream cookie
			$('.stream-blog').css({
				top: $.cookie('streamBlogY')*1,
				left: $.cookie('streamBlogX')*1
			}).draggable({
				stop: function(event, ui) {
					$.cookie('streamBlogX',ui.position.left);
					$.cookie('streamBlogY',ui.position.top);
					$('.stream-position-reset-wrap').css('display', 'block');
				}
			});
			
			// Twitter stream cookie
			$('.stream-twitter').css({
				top: $.cookie('streamTwitterY')*1,
				left: $.cookie('streamTwitterX')*1
			}).draggable({
				stop: function(event, ui) {
					$.cookie('streamTwitterX',ui.position.left);
					$.cookie('streamTwitterY',ui.position.top);
					$('.stream-position-reset-wrap').css('display', 'block');
				}
			});
			
			// Facebook stream cookie
			$('.stream-facebook').css({
				top: $.cookie('streamFacebookY')*1,
				left: $.cookie('streamFacebookX')*1
			}).draggable({
				stop: function(event, ui) {
					$.cookie('streamFacebookX',ui.position.left);
					$.cookie('streamFacebookY',ui.position.top);
					$('.stream-position-reset-wrap').css('display', 'block');
				}
			});
			
			// Tumblr stream cookie
			$('.stream-tumblr').css({
				top: $.cookie('streamTumblrY')*1,
				left: $.cookie('streamTumblrX')*1
			}).draggable({
				stop: function(event, ui) {
					$.cookie('streamTumblrX',ui.position.left);
					$.cookie('streamTumblrY',ui.position.top);
					$('.stream-position-reset-wrap').css('display', 'block');
				}
			});
			
			// Delicious stream cookie
			$('.stream-delicious').css({
				top: $.cookie('streamDeliciousY')*1,
				left: $.cookie('streamDeliciousX')*1
			}).draggable({
				stop: function(event, ui) {
					$.cookie('streamDeliciousX',ui.position.left);
					$.cookie('streamDeliciousY',ui.position.top);
					$('.stream-position-reset-wrap').css('display', 'block');
				}
			});
			
			// Last.fm stream cookie
			$('.stream-lastfm').css({
				top: $.cookie('streamLastfmY')*1,
				left: $.cookie('streamLastfmX')*1
			}).draggable({
				stop: function(event, ui) {
					$.cookie('streamLastfmX',ui.position.left);
					$.cookie('streamLastfmY',ui.position.top);
					$('.stream-position-reset-wrap').css('display', 'block');
				}
			});
			
			// Wakoopa stream cookie
			$('.stream-wakoopa').css({
				top: $.cookie('streamWakoopaY')*1,
				left: $.cookie('streamWakoopaX')*1
			}).draggable({
				stop: function(event, ui) {
					$.cookie('streamWakoopaX',ui.position.left);
					$.cookie('streamWakoopaY',ui.position.top);
					$('.stream-position-reset-wrap').css('display', 'block');
				}
			});
			
			// Flickr stream cookie
			$('.stream-flickr').css({
				top: $.cookie('streamFlickrY')*1,
				left: $.cookie('streamFlickrX')*1
			}).draggable({
				stop: function(event, ui) {
					$.cookie('streamFlickrX',ui.position.left);
					$.cookie('streamFlickrY',ui.position.top);
					$('.stream-position-reset-wrap').css('display', 'block');
				}
			});
			
	
			
			// Initialize Fancybox
			initializeFancybox();

		});
	
	
	
	// Show mtip on stream-wrap mouseenter
	$('.stream-wrap').live({
			mouseenter:
				function(){
					showMtip('.'+$(this).attr('class').split(' ')[1]+' .stream-logo');

					if($(this).attr('class').split(' ')[1] == 'stream-latitude'){
						setTimeout('mapButtonMtip()', 1500)
					}
			},
			mouseleave:
				function(){
					hideMtip('.'+$(this).attr('class').split(' ')[1]+' .stream-logo');

					if($(this).attr('class').split(' ')[1] == 'stream-latitude'){
						hideMtip('.latitude-map-button .mtip');
					}
			}
	});
		
}



/* --------------------------------------------------
 * About page functions
 * ----------------------------------------------- */

// Initialize about page map
function initializeAboutMap() {

	var latlng = new google.maps.LatLng(33.934815,-117.547703);
	var myOptions = {
			zoom: 5,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

	var map = new google.maps.Map(document.getElementById('mapabout'), myOptions);

	var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: "Norco, CA"
		});
	
	marker.setAnimation(google.maps.Animation.DROP);
}



/* --------------------------------------------------
 * Portfolio page functions
 * ----------------------------------------------- */

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



function portfolioPage(){

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
				jQuery('.project-overlay-popup', this).animate({bottom: '0'}, {queue: false, duration: 150});
		},
		mouseleave:
			function(){
				jQuery('.project-overlay-popup', this).animate({bottom: '-100px'}, {queue: false, duration: 125});
		}
	});
	

	
	// Initialize Fancybox
	initializeFancybox();
	
}



/* --------------------------------------------------
 * Contact page functions
 * ----------------------------------------------- */
function contactPage(){
	
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

	
}



/* --------------------------------------------------
 * Blog page functions
 * ----------------------------------------------- */

 /* ------------------------
 * Blog post sort functions
 * --------------------- */

// Show grid sort
function blogSortGrid() {
		$('.blog-post-sort-wrap a').removeClass('icon-no-hover icon-no-opacity');
		$('.blog-post-sort-grid').addClass('icon-no-hover icon-no-opacity');
		$('.blog-post-list').slideUp('fast');
		$('.blog-post-grid').slideDown('fast');
		$.cookie('blogSort', 'grid');
}

// Show list sort
function blogSortList() {
		$('.blog-post-sort-wrap a').removeClass('icon-no-hover icon-no-opacity');
		$('.blog-post-sort-list').addClass('icon-no-hover icon-no-opacity');
		$('.blog-post-grid').slideUp('fast');
		$('.blog-post-list').slideDown('fast');
		$.cookie('blogSort', 'list');
}



function blogPage(){

	// Set blog sort cookie
	if($.cookie('blogSort') == null) {
		$.cookie('blogSort', 'grid', {
				expires: 7,
				path: '/'
			}
		);
	}
	
	// Sort blog posts based on cookie
	if ($.cookie('blogSort') == 'grid') {
		blogSortGrid();
	}
	else if($.cookie('blogSort') == 'list') {
		blogSortList();
	}
	else {
		$.cookie('blogSort', 'grid');
	}


	
	// Get AddThis script
	// $.getScript('http://s7.addthis.com/js/250/addthis_widget.js#username=miguelmota');
	
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



/* hide white flash on iframe 
// Prevent variables from being global
(function () {

      ///
          1. Inject CSS which makes iframe invisible
      ///

    var div = document.createElement('div'),
        ref = document.getElementsByTagName('base')[0] ||
              document.getElementsByTagName('script')[0];

    div.innerHTML = '&shy;<style> iframe { visibility: hidden; } </style>';

    ref.parentNode.insertBefore(div, ref);

    ///
        2. When window loads, remove that CSS,
           making iframe visible again
    ///

    window.onload = function() {
        div.parentNode.removeChild(div);
    }

})();
*/

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
