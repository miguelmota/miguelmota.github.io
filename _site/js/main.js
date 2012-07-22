// MAIN SCRIPTS

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
		}
	});
	


	// Highlight icon on link hover
	$('a:not(".selected, .blog-post-list a"):has(".icon")').live({
			mouseenter:
				function() {
					$('.icon', this).addClass('icon-no-opacity');
				},
			mouseleave:
				function() {
					$('.icon', this).removeClass('icon-no-opacity');
				}
	});
	


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
	$('.mtip, .icon-social').mtippy();

	setTimeout(function() {
		$('.icon-social.icon-twitter-24').trigger('mouseenter').trigger('mouseleave');
	}, 2000);
	setTimeout(function() {
		$('.icon-social.icon-facebook-24').trigger('mouseenter').trigger('mouseleave');
	}, 2500);
	setTimeout(function() {
		$('.icon-social.icon-flickr-24').trigger('mouseenter').trigger('mouseleave');
	}, 3000);
	setTimeout(function() {
		$('.icon-social.icon-lastfm-24').trigger('mouseenter').trigger('mouseleave');
	}, 3400);
	setTimeout(function() {
		$('.icon-social.icon-tumblr-24').trigger('mouseenter').trigger('mouseleave');
	}, 3800);
	setTimeout(function() {
		$('.icon-social.icon-gplus-24').trigger('mouseenter').trigger('mouseleave');
	}, 4200)
	setTimeout(function() {
		$('.icon-social.icon-feed-24').trigger('mouseenter').trigger('mouseleave');
	}, 4500);

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

// format date unix timestamp function
function formattedDateUnix(d) {
  	var date = new Date(d*1000);
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
$.getScript('https://api.twitter.com/1/statuses/user_timeline.json?callback=recent_tweets&include_entities=true&include_rts=true&screen_name=miguel_mota&count=5');



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
