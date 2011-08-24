$(document).ready(function(){
	
	//display mobile link if window is 640px or less
	if(window.innerWidth <= 640){
		window.location = 'http://www.miguelmota.com/mobile/';
		$('div.main-wrap').prepend("<a class='mobile-bar' href='/mobile'>view mobile site &#187;</a><a class='mobile-bar-close' href='javascript:void(0);'>x</a>");
		$('a.mobile-bar').hide();
		setTimeout(function(){
			$('a.mobile-bar').slideDown('slow');
		}, 2500);
		$('a.mobile-bar-close').live('click', function(){
			$(this).hide();
			$('a.mobile-bar').slideUp('normal');
		});
	}
	
	//display ie message
	$('body').fadeIn(650, function(){
		$('div.ie-bar').slideDown('slow');
	});
	
	//close ie message
	$('div.ie-bar a.ie-bar-close').click(function(){
		$('div.ie-bar').slideUp('normal');
	});
	
	//redirect to homepage if window location alone is #!
	if(typeof(window.history.pushState) != 'function'){
		if(window.location.hash == '#!') {
			window.location = '/';
		}
	}
	
	
	// Open external links in new tab
	$('a[href^=http]').live('click', function(){
		window.open(this.href);
		return false;
	});
	
	
	//initialize text ticker
	//textticker(); //disabled, firefox bug
	
	//check pathname and add selected class to nav link
	//run appropriate function
	/*
	switch(pathname.substr(1)){
		case 'stream':
			streamPage();
			$('a#stream').addClass('selected');
			break;
		case 'about':
			$('a#about').addClass('selected');
			break;
		case 'portfolio/':
			portfolioPage();
			$('a#portfolio').addClass('selected');
			break;
		case 'contact':
			contactPage();
			$('a#contact').addClass('selected');
			break;
		case 'blog':
		default:
			blogPage();
			$('a#blog').addClass('selected');
			break;
	}
	
	if(pathname.substr(1,10) == 'portfolio/'){
		portfolioPage();
	}
	
	
	switch(pathname.substr(1,4)){
	case 'post':
		blogPage();
		$('a#blog').addClass('selected');
		break;
	default:
		break;
	}
	switch(pathname.substr(1,7)){
	case 'archive':
		$('a#blog').addClass('selected');
		break;
	default:
		break;
	}
	*/
	
	
	// add selected class based on the section block class
	$('ul.main-nav li a').each(function(){ 
		if($(this).attr('id') == $('section.content').attr('class').split(' ')[1]){
			$(this).addClass('selected');
			switch($('section.content').attr('class').split(' ')[1]){
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
	
	
	
	/*
	$('ul.main-nav li a').each(function(){
		if($(this).attr('href') == pathname){
			//$('ul.main-nav a#stream').removeClass('selected');
			//$(this).addClass('selected');
			
		}
		else{
			//initialize stream
			streamPage();
			//document.title = 'Miguel Mota | Freelance Web Developer';
		}
	});
	$('a#'+$('span.sub').text()).addClass('selected');
	*/
	
	//append title
	$('body').append("<div class='theTitle' style='display: none;'> &#8212; Miguel Mota | Freelance Web Developer</div>");
	
	//redirect to poper page if pushSate not supported
	if(typeof(window.history.pushState) != 'function'){
		if(window.location.hash){
			window.location = '/'+window.location.hash.substr(2);
		}
	}
	
	//back to top smooth scroll effect
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
		$('a.top-link').animate({top:offset},{duration:500,queue:false});
	});
	topYloc = parseInt($('a.top-link').css('top').substring(0,$('a.top-link').css('top').indexOf('px')));

	
});

$(window).scroll(function(){
	
	//toggle back to top link on scroll
	if(window.pageYOffset >= 200){
		$('a.top-link').fadeIn(600);
	}
	if(window.pageYOffset < 200){
		$('a.top-link').fadeOut(185);
	}
	
});
var bsc = 0;
$(document).ajaxComplete(function(){
	while (c == 0){
		if(typeof(window.history.pushState) != 'function'){
			//var path2 = window.location.hash.substr(2);
			var path2 = window.location.pathname.substr(1);
		}
		else{
			var path2 = window.location.pathname.substr(1);
		}
		var title = $('h1.title span.sub:first').text()+$('div.theTitle').text();
		//document.title = title;
		
		$('ul.main-nav a').removeClass('selected');
		while(bsc == 0) {
			if($('section.content').attr('class').split(' ')[2] == 'post' || $('section.content').attr('class').split(' ')[2] == 'archive'){
	
					$('ul.main-nav a#blog').addClass('selected');
	
			}
			else {
				$('ul.main-nav a').removeClass('selected');
			}
		bsc++;
		}
		
		
		if(path2 != ''){
			$('ul.main-nav a#'+path2).addClass('selected');
		}
		else{
			$('ul.main-nav a#stream').addClass('selected');
			//document.title = 'Miguel Mota | Freelance Web Developer';
		}
		
	
		switch(path2){
			case '':
			case 'index':
			case 'stream':
				streamPage();
				break;
			case 'portfolio':
			case 'portfolio/':
				portfolioPage();
				break;
			case 'contact':
				contactPage();
				break;
			case 'blog': 
				blogPage();
				break;
			default:
				break;
		}
		c++;
	}

	
});

//global variables
var c = 0;
var bc = 0;
var ldc = 0;

var pathname = window.location.pathname;

/*
//can't get it to work
function loadPage(){
	
	var toLoad = '/'+window.location.hash.substr(12)+' section.content';
	//window.location.hash = window.location.hash.substr(1);
	$('section.content').fadeOut('fast',loadContent);
	$('div.loader-container').fadeIn('normal');
	function loadContent(){
		$('section.content').load(toLoad, showNewContent);
	}
	return false;
}
*/

//convert UTC time to niceTime, ie. 2 hours ago
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

$("ul.main-nav a:not('.nav-logo, #blog')").live('click', function(){
		if(typeof(window.history.pushState) == 'function'){
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


/*
 //not gonna use anymore
$('div.posti h3 a').live('click', function(){
	var toLoad2 = $(this).attr('href')+' div.posti';

	$('div.posti').fadeOut('fast',loadContent2);
	$('div.loader-container').fadeIn('normal');
	if(typeof(window.history.pushState) == 'function'){
		var stateObj2 = { foo2:  $(this).attr('href') };
		history.pushState(stateObj2, "Title2", $(this).attr('href'));
	}
	else{
		window.location.hash = '!'+$(this).attr('href').substr(1,$(this).attr('href').length);
	}
	var title2 = $(this).text()+$('div.theTitle').text();
	document.title = title2;
	function loadContent2(){
		$('div.posti').load(toLoad2,showNewContent2);
		function showNewContent2(){
			//$('ul.main-nav a').removeClass('selected'); //commented because of testing
			//$('#'+window.location.hash.substr(2)).addClass('selected'); //commented because of testing
			$('div.posti').fadeIn('normal',hideLoader);
			//var title = $('span.sub').text()+$('div.theTitle').text(); //commented because of testing
			//document.title = title; //commented because of testing
			//if(window.location.hash == '#!'){
				//document.title = theTitle; //commented because testing
			//}
			loadDisqus();
		}
	}
	return false;
});

*/

var position = 0;
var length = 'portfolio'.length;
function textticker(){
	
	$('a#stream').text('stream'.substring(0,position));
	$('a#about').text('about'.substring(0,position));
	$('a#portfolio').text('portfolio'.substring(0,position));
	$('a#contact').text('contact'.substring(0,position));
	$('a#blog').text('blog'.substring(0,position));
	
	if(position++ == 8){
		setTimeout('textticker()',1000);
	} 
	else{
		setTimeout('textticker()',60);
	}
	
}

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

function showMtip(element) {
	var link = element;
	$(link).trigger('mouseenter');
	setTimeout(function(){
		$(link).trigger('mouseleave');
	}, 3000);
}

function streamPage(){
	

	
	
	//hide social link text
	$("div.stream a.social:not('.latitude')").text('');
	showMtip('a.social.latitude');
	
	while(c == 0){	
		
		//initialize mtip
		$('.mtip').mtip();
		
		// Twitter stream
		$('div.twitter div.loader').css('display','block');
		$.getJSON('http://twitter.com/status/user_timeline/miguel_mota.json?&count=5&callback=?', 
				function(data){
					$.each(data, function(i, status){
						var post = status.text;
						var id = status.id_str;
			    	  	var date = new Date(status.created_at).toUTCString();
				        var newText = '<span>'+post.split(' ').join('</span> <span>')+'</span>';
			    	  	$('ul.twitter-status').append("<li id='"+id+"' class='status'>&#187; <span class='post'>"+newText+"</span> <span class='stream-date'><a href='http://twitter.com/miguel_mota/status/"+id+"'>"+niceTime(date)+"</a></span></li>");
			    	    $("li.status[id='"+id+"'] span").find(":contains('http')").wrapInner("<a href='"+$("li.status[id='"+id+"'] span").find(":contains('http')").text()+"'> </a>");
			    	    $("li.status[id='"+id+"'] span").find(":contains('@')").wrapInner("<a href='http://twitter.com/"+$("li.status[id='"+id+"'] span").find(":contains('@')").text().substr(1)+"'> </a>");
					});
					$('div.twitter div.loader').css('display','none');
					showMtip('a.social.twitter');
				}
		);
		
		// Facebook stream
		$('div.facebook div.loader').css('display','block');
		$.getJSON('https://graph.facebook.com/miguel.mota2/feed?limit=3&callback=?', 
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
				    	    $('ul.facebook-status').append("<li class='status'>&#187; <span class='post'>"+post+"</span> <span class='stream-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
				    	    break;
			    	  	case 'link':
			    	  		if(post){
					    	    $('ul.facebook-status').append("<li class='status'>&#187; Link: <span class='post'>"+post+" <a href='"+link+"'>"+name+"</a></span> <span class='stream-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
			    	  		}
			    	  		else{
			    	  			$('ul.facebook-status').append("<li class='status'>&#187; Link: <a href='"+link+"'>"+name+"</a></span> <span class='stream-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
			    	  		}
				    	    break;
			    	  	case 'video':
			    	  		if(post){
			    	  			$('ul.facebook-status').append("<li class='status'>&#187; Video: <span class='post'>"+post+" <a href='"+link+"'>"+name+"</a></span> <span class='stream-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
			    	  		}
			    	  		else{
					    	    $('ul.facebook-status').append("<li class='status'>&#187; Video: <span class='post'><a href='"+link+"'>"+name+"</a></span> <span class='stream-date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
			    	  		}
				    	    break;
			    	  	default:
			    	  		break;
			    	  	}
					});
					$('div.facebook div.loader').css('display','none');
					showMtip('a.social.facebook');
				}
		);
		
		
		// Tumblr stream
		$('div.tumblr div.loader').css('display','block');
		$.getJSON('http://miguelmota.tumblr.com/api/read/json?num=3&callback=?', 
				function(data){
					$.each(data.posts, function(i, posts){ 
				    	  	var date = new Date(this['date-gmt']).toUTCString();
				    	  	var url = this.url;
				    	  	var caption = this['photo-caption'];
				    	  	var slug = this.slug.replace(/-/g,' ');
				    	  	$('ul.tumblr-posts').append("<li>&#187; <a href='"+url+"'>"+slug.substring(0,1).toUpperCase()+slug.substr(1,200)+"</a> <span class='stream-date'>"+niceTime(date)+"</span></li>");
				      }); 
					  $('div.tumblr div.loader').css('display','none');
					showMtip('a.social.tumblr');
				  }
		);
		
		// Delicious stream
		$('div.delicious div.loader').css('display','block');
		$.getJSON('http://feeds.delicious.com/v2/json/miguelmota/?count=3&callback=?', 
				function(data){
					$.each(data, function(i, item){
						var title = item.d;
						var url = item.u;
			    	  	var date = new Date(item.dt).toUTCString();
						$('ul.delicious-bookmarks').append("<li>&#187; <a href='"+url+"'>"+title+"</a> <span class='stream-date'>"+niceTime(date)+"</span></li>");
					});
					$('div.delicious div.loader').css('display','none');
					showMtip('a.social.delicious');
			}
		);
		
		// Last.fm stream
		$('div.lastfm div.loader').css('display','block');
		$.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=miguel_mota&api_key=b25b959554ed76058ac220b7b2e0a026&format=json&limit=5&callback=?', 
				function(data){       
					$.each(data.recenttracks.track, function(i, item){ 
							var url = item.url;
							var name = item.name;
							var artist = item.artist['#text'];
							var date =  item.date['#text'];
							$('ul.lastfm-tracks').append("<li><a class='link' href='"+url+"'>"+artist+" - "+name+"</a> <span class='stream-date'>"+date+"</span></li>");
					}); 
					$('div.lastfm div.loader').css('display','none');
					showMtip('a.social.lastfm');
				}
		);
		
		// Wakoopa stream
		$('div.wakoopa div.loader').css('display','block');
		$.getJSON('http://api.wakoopa.com/miguelmota/recently_used.json?limit=3&callback=?', 
			function wakoopaApi(data){
				var html = ["<ul class='wakoopa-software'>"];
				for(var i = 0; i < data.length; i++){
					var entry = data[i].software;
					var date = new Date(entry.last_active_at).toUTCString();
					html.push("<li><a class='link' href='", entry.complete_url, "'>", entry.name, "</a> <span class='stream-date'>"+niceTime(date)+"</span>", "</li>");
				}
				html.push("</ul>");
				document.getElementById('wakoopa-software').innerHTML = html.join("");
				$('div.wakoopa div.loader').css('display','none');
				showMtip('a.social.wakoopa');
			}
		);
		c++
		refreshStream();
	}
	
	//refresh stream page every 30 seconds
	function refreshStream(){
		setTimeout(function(){
			if(window.location.pathname.substr(1) == 'stream' || window.location.pathname.substr(1) == 'index' || window.location.pathname == ''){
				$('a#stream').trigger('click');
			}
		},30000);
	}
	
}


function portfolioPage(){
	
	/*
	
	//show all work with effect
	$('section.portfolio div.sort a#all').live('click', function(){
		$('section.portfolio div.sort a').removeClass('selected');
		$(this).addClass('selected');
		$('section.portfolio div.identity, section.portfolio div.web').slideDown('fast');
	});

	//show web work with effect 
	$('section.portfolio div.sort a#web').live('click', function(){
		$('section.portfolio div.sort a').removeClass('selected');
		$(this).addClass('selected');
		$('section.portfolio div.identity').slideUp('fast');
		$('section.portfolio div.web').slideDown('fast');
	});
	
	//show identity work with effect
	$('section.portfolio div.sort a#identity').live('click', function(){
		$('section.portfolio div.sort a').removeClass('selected');
		$(this).addClass('selected');
		$('section.portfolio div.web').slideUp('fast');
		$('section.portfolio div.identity').slideDown('fast');
	});
	*/
	
	//hover glow effect
	$('div.image-container').live({
		mouseenter:
			function(){
				jQuery('span.overlay', this).fadeOut(200);
				$(this).css({
					'-webkit-box-shadow': '0 0 10px #fff',
					'-moz-box-shadow': '0 0 10px #fff',
					'box-shadow': '0 0 10px #fff'
					});
	},
		mouseleave:
			function(){
				jQuery('span.overlay', this).hide().fadeIn(300);
				$(this).css({
					'-webkit-box-shadow': '2px 2px 5px #111',
					'-moz-box-shadow': '2px 2px 5px #111',
					'box-shadow': '2px 2px 5px #111'
					});
		  }
	});
	
	
	
	// Show zoom icon on hover
	$('a.fancybox').hover(function(){
			jQuery('span.zoom-icon', this).css('display', 'block');
	},function(){
			jQuery('span.zoom-icon', this).hide();
		  }
	);
	
	
	
	//initialize fancybox
	$('a.fancybox').fancybox({
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
	//custom fancybox title formatting
	function formatTitle(title, currentArray, currentIndex, currentOpts) {
	    return '<div class="fancybox-title"><span><a href="javascript:void(0);" onclick="$.fancybox.close();">close X</a></span>' + (title && title.length ? '<strong>' + title + '</strong>' : '' ) + 'Image ' + (currentIndex + 1) + ' of ' + currentArray.length + '</div>';
	}
	
}

function contactPage(){
	
	//create method to validate name
	$('a.contact-submit').live('click', function(){
		$.validator.addMethod('namecheck', function(value, element){
			return this.optional(element) || /^[a-zA-Z]+?\s?[a-zA-Z]+?\s?[a-zA-Z]+$/.test(value);
	});
		
	//validate contact form
	$('form.contact-form').validate({
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
				minlength: 10
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
	
	//if validates to true, then submit it
	if ($('form.contact-form').valid() == true){						  
		var str = $('form.contact-form').serialize();
		$.ajax({
			type: 'post',
			url: 'http://www.foodfail.org/miguelmota/contact.php',
			data: str,
			success: function(){
				success();
			},
			error: function(){
				success();
			}
		});
		return false;
	}
	else
		return false;
	});
	
	//hide contact form and display thank you message
	function success(){
		$('form.contact-form').slideUp(300);
		setTimeout(function(){
			$('form.contact-form').html('<p>Thank you.<br />Your message has been successfully sent!<br />I will get in touch with you soon.</p>').fadeIn(1200);	
		}, 300);
	}
	
}
tc = 0;
function blogPage(){
	

	//initialize AddThis
	//$.getScript('http://s7.addthis.com/js/250/addthis_widget.js#username=miguelmota');
	
	// Initialize Twitter widgets
	while(tc==0){
		$.getScript('http://platform.twitter.com/widgets.js');

	
	
	// Initiatlize Google Plus One
	(function() {
		  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		  po.src = 'https://apis.google.com/js/plusone.js';
		  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		})();

    tc++;
	}
	//initialize Google Search
	//loadSearch();
	
	//initialize Disqus
	while(ldc = 0){
		//loadDisqus();
		ldc++;
	}
	
}

function loadDisqus(){
}

//load Google Search function

function loadSearch(){


}



function displayYear(){
	var date = new Date();
	var thisYear = date.getFullYear();
	
	document.write(thisYear);
}


function displayURL(){
	document.write(pathname);
}
