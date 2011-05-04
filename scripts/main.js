$(document).ready(function(){
	
	//display mobile link if window is 640px or less
	if(window.innerWidth <= 640){
		$('div#wrap').prepend("<a id='mobile_bar' href='/mobile'>view mobile site</a><a id='mobile_close' href='javascript:void(0);'>x</a>");
		$('a#mobile_close').live('click', function(){
			$(this).hide();
			$('a#mobile_bar').slideUp('normal');
		});
	}
	
	//display ie message
	$('body').fadeIn(650, function(){
		$('div#ie').slideDown('slow');
	});
	
	//close ie message
	$('div#ie a#close').click(function(){
		$('div#ie').slideUp('normal');
	});

	//textticker(); //commented because of firefix bug
	//if(window.location.pathname == '') {
		//streamPage();
	//}
	
	//redirect to homepage if window location alone is #!
	if(typeof(window.history.pushState) != 'function'){
		if(window.location.hash == '#!') {
			window.location = '/';
		}
	}
	
	//initialize stream
	streamPage();
	$('nav.main a#stream').addClass('selected');
	
	
	//check pathname and add selected class to nav link
	var pathname = window.location.pathname;
	$('ul.nav li a').each(function(){
		if($(this).attr('href') == pathname){
			$('nav.main a#stream').removeClass('selected');
			$(this).addClass('selected');
			
			//run appropriate function
			switch($(this).attr('id')){
				case 'stream':
					streamPage();
					break;
				case 'portfolio':
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
			
		}
	});
	
	//
	$('body').append("<div class='theTitle' style='display: none;'> &#8212; Miguel Mota | Freelance Web Developer</div>");
	if(typeof(window.history.pushState) != 'function'){
		if(window.location.hash){
			//var domain = document.domain;  //commented because of firefox bug
			//if(domain == 'www.miguelmota.com') {  //commented because of firefox bug
				loadPage();
			//}  //commented because of firefox bug
		}
		else {
			redirectPath();
		}
	}
	function loadPage(){
		var toLoad = '/'+window.location.hash.substr(2)+' section.content';
		window.location.hash = window.location.hash.substr(1);
		$('section.content').fadeOut('fast',loadContent);
		$('div.loader').fadeIn('normal');
		function loadContent(){
			$('section.content').load(toLoad,showNewContent);
		}
		return false;
	}
	if(typeof(window.history.pushState) != 'function'){
		function redirectPath(){
			//var domain = document.domain; //commented because of firefox bug
			var pathname = window.location.pathname.substr(1);
			//if(document.domain == 'www.miguelmota.com') { //commented because of firefox bug
			switch(pathname){
				case '':
				case 'index':
				case 'stream':
					break;
				case 'portfolio':
					break;
				case 'contact':
					break;
				case 'blog': 
					break;
					window.location = './#!'+path;
				default:
					break;
			}
			//} //commented because of firefox bug
		}
	}
	$(window).scroll(function () { 
		var scrollTop = $(document).scrollTop();
		scrollTop = parseInt(scrollTop);
		var offset = topYloc+scrollTop+'px';  
		$('a.top').animate({top:offset},{duration:500,queue:false});
	});
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
	topYloc = parseInt($('a.top').css('top').substring(0,$('a.top').css('top').indexOf('px')));
});
$(window).scroll(function(){
	if(window.pageYOffset >= 200){
		$('a.top').fadeIn(600);
	}
	if(window.pageYOffset < 200){
		$('a.top').fadeOut(185);
	}
	
	
});
$(document).ajaxComplete(function(){
	if(typeof(window.history.pushState) != 'function'){
		var path2 = window.location.hash.substr(2);
	}
	else {
		var path2 = window.location.pathname.substring(1);
	}
	switch(path2){
		case '':
		case 'index':
		case 'stream':
			streamPage();
			break;
		case 'portfolio':
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
	if(window.location.pathname.substr(1,4) == 'post'){
		while(bc == 0) {
			blogPage();
			$('nav.main a#stream').removeClass('selected');
			$('nav.main a#blog').addClass('selected');
			bc++;
		}
	}
	if(window.location.pathname.substr(1) == 'archive'){
		$('nav.main a#stream').removeClass('selected');
		$('nav.main a#blog').addClass('selected');
	}
});


var c = 0;
var bc = 0;

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

$("nav.main a:not('#logo')").live('click', function(){
	//var domain = document.domain; //commented because of firefox bug
	//if(document.domain == 'www.miguelmota.com') { //commented because of firefox bug
		c = 0;
		bc = 0;
		var toLoad = $(this).attr('href')+' section.content';
		$('section.content').fadeOut('fast',loadContent);
		$('div.loader').fadeIn('normal');
		function loadContent(){
			$('section.content').load(toLoad,showNewContent);
		}
		if(typeof(window.history.pushState) == 'function'){
			var stateObj = { foo:  $(this).attr('href') };
			history.pushState(stateObj, "Title", $(this).attr('href'));
		}
		else{
			//window.location.hash = '!'+$(this).attr('href').substr(1,$(this).attr('href').length); //won't load for some reason
			window.location = $(this).attr('href');
		}
		return false;
	//} //commented because of firefox bug
});

$('div.posti h3 a').live('click', function(){
	var toLoad2 = $(this).attr('href')+' div.posti';

	$('div.posti').fadeOut('fast',loadContent2);
	$('div.loader').fadeIn('normal');
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
			//$('nav.main a').removeClass('selected'); //commented because of testing
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
function loadDisqus(){
    var disqus_shortname = 'miguelmota';
    var disqus_url = 'http://wwww.miguelmota.com/{{ page.url }}';
    //comment box
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
    //comment count
    (function () {
        var s = document.createElement('script'); s.async = true;
        s.type = 'text/javascript';
        s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
        (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('body')[0]).appendChild(s);
    }());
}
var position = 0;
var length = 'portfolio'.length;
function textticker(){
	$('a#stream').text('stream'.substring(0,position));
	$('a#about').text('about'.substring(0,position));
	$('a#portfolio').text('portfolio'.substring(0,position));
	$('a#contact').text('contact'.substring(0,position));
	$('a#blog').text('blog'.substring(0,position));
	if(position++ == length){
		setTimeout('textticker()',1000);
	} else
		setTimeout('textticker()',60);
}
function showNewContent(){
	$('nav.main a').removeClass('selected');
	if(typeof(window.history.pushState) != 'function'){
		$('#'+window.location.hash.substr(2)).addClass('selected');
	}
	$('#'+window.location.pathname.substr(1)).addClass('selected');
	$('section.content, footer.main').fadeIn('normal',hideLoader);
	var title = $('span.sub').text()+$('div.theTitle').text();
	document.title = title;
	if(typeof(window.history.pushState) != 'function'){
		if(window.location.hash == '#!'){
			$('#'+window.location.hash.substr(2));
			document.title = theTitle;
		}
	}
}

function hideLoader(){
	$('div.loader').hide();
}

function streamPage(){
	
	//initialize mtip
	$('.mtip').mtip();
	
	while(c == 0){
		
		//Facebook stream
		$('div.facebook img.loader').css('display','block');
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
				    	    $('ul.facebook_status').append("<li class='status'>&#187; <span class='post'>"+post+"</span> <span class='date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
				    	    break;
			    	  	case 'link':
			    	  		if(post){
					    	    $('ul.facebook_status').append("<li class='status'>&#187; Link: <span class='post'>"+post+" <a href='"+link+"'>"+name+"</a></span> <span class='date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
			    	  		}
			    	  		else {
			    	  			$('ul.facebook_status').append("<li class='status'>&#187; Link: <a href='"+link+"'>"+name+"</a></span> <span class='date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
			    	  		}
				    	    break;
			    	  	case 'video':
				    	    $('ul.facebook_status').append("<li class='status'>&#187; Video: <span class='post'>"+post+" <a href='"+link+"'>"+name+"</a></span> <span class='date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
				    	    break;
			    	  	default:
			    	  		break;
			    	  	}
					});
					$('div.facebook img.loader').css('display','none');
				}
		);
		
		//Twitter stream
		$('div.twitter img.loader').css('display','block');
		$.getJSON('http://twitter.com/status/user_timeline/miguel_mota.json?&count=5&callback=?', 
				function(data){
					$.each(data, function(i, status){
						var post = status.text;
						var id = status.id_str;
			    	  	var date = new Date(status.created_at).toUTCString();
				        var newText = '<span>'+post.split(' ').join('</span> <span>')+'</span>';
			    	  	$('ul.twitter_status').append("<li id='"+id+"' class='status'>&#187; <span class='post'>"+newText+"</span> <span class='date'><a href='http://twitter.com/miguel_mota/status/"+id+"'>"+niceTime(date)+"</a></span></li>");
			    	    $("li.status[id='"+id+"'] span").find(":contains('http')").wrapInner("<a href='"+$("li.status[id='"+id+"'] span").find(":contains('http')").text()+"'> </a>");
			    	    $("li.status[id='"+id+"'] span").find(":contains('@')").wrapInner("<a href='http://twitter.com/"+$("li.status[id='"+id+"'] span").find(":contains('@')").text().substr(1)+"'> </a>");
					});
					$('div.twitter img.loader').css('display','none');
				}
		);
		
		//Tumblr stream
		$('div.tumblr img.loader').css('display','block');
		$.getJSON('http://miguelmota.tumblr.com/api/read/json?num=3&callback=?', 
				function(data){
					$.each(data.posts, function(i, posts){ 
				    	  	var date = new Date(this['date-gmt']).toUTCString();
				    	  	var url = this.url;
				    	  	var caption = this['photo-caption'];
				    	  	var slug = this.slug.replace(/-/g,' ');
				    	  	$('ul.tumblr_posts').append("<li>&#187; <a href='"+url+"'>"+slug.substring(0,1).toUpperCase()+slug.substr(1,200)+"</a> <span class='date'>"+niceTime(date)+"</span></li>");
				      }); 
					  $('div.tumblr img.loader').css('display','none');
				  }
		);
		
		//Delicious stream
		$('div.delicious img.loader').css('display','block');
		$.getJSON('http://feeds.delicious.com/v2/json/miguelmota/?count=3&callback=?', 
				function(data){
					$.each(data, function(i, item){
						var title = item.d;
						var url = item.u;
			    	  	var date = new Date(item.dt).toUTCString();
						$('ul.delicious_bookmarks').append("<li>&#187; <a href='"+url+"'>"+title+"</a> <span class='date'>"+niceTime(date)+"</span></li>");
					});
					$('div.delicious img.loader').css('display','none');
			}
		);
		
		//Last.fm stream
		$('div.lastfm img.loader').css('display','block');
		$.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=miguel_mota&api_key=b25b959554ed76058ac220b7b2e0a026&format=json&limit=5&callback=?', 
				function(data){       
					$.each(data.recenttracks.track, function(i, item){ 
							var url = item.url;
							var name = item.name;
							var artist = item.artist['#text'];
							var date =  item.date['#text'];
							$('ul.lastfm_tracks').append("<li><a class='link' href='"+url+"'>"+artist+" - "+name+"</a> <span class='date'>"+date+"</span></li>");
					}); 
					$('div.lastfm img.loader').css('display','none');
				}
		);
		
		//Wakoopa stream
		$('div.wakoopa img.loader').css('display','block');
		$.getJSON('http://api.wakoopa.com/miguelmota/recently_used.json?limit=3&callback=?', 
			function wakoopaApi(data){
				var html = ["<ul class='wakoopa_software'>"];
				for(var i = 0; i < data.length; i++){
					var entry = data[i].software;
					var date = new Date(entry.last_active_at).toUTCString();
					html.push("<li><a class='link' href='", entry.complete_url, "'>", entry.name, "</a> <span class='date'>"+niceTime(date)+"</span>", "</li>");
				}
				html.push("</ul>");
				document.getElementById('wakoopa_software').innerHTML = html.join("");
				$('div.wakoopa img.loader').css('display','none');
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
	
	//hover glow effect
	$('section.portfolio div.container').hover(function(){
				jQuery('div.overlay', this).fadeOut(300);
				$(this).css({
					'-webkit-box-shadow': '0 0 10px #fff',
					'-moz-box-shadow': '0 0 10px #fff',
					'box-shadow': '0 0 10px #fff'
					});
	},function(){
				jQuery('div.overlay', this).hide().fadeIn(300);
				$(this).css({
					'-webkit-box-shadow': '2px 2px 5px #111',
					'-moz-box-shadow': '2px 2px 5px #111',
					'box-shadow': '2px 2px 5px #111'
					});
		  }
	);
	
	//initialize fancybox
	$('a.fancybox').fancybox({
			'padding': 0,
			'transitionIn': 'fade',
			'transitionOut': 'fade',
			'speedIn': 600, 
			'speedOut': 200, 
			'overlayColor': '#000'
	});
	
}

function contactPage(){
	
	//create method to validate name
	$('form.contact_form a.submit').live('click', function(){
		$.validator.addMethod('namecheck', function(value, element){
			return this.optional(element) || /^[a-zA-Z]+?\s?[a-zA-Z]+?\s?[a-zA-Z]+$/.test(value);
	});
		
	//validate contact form
	$('form.contact_form').validate({
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
				namecheck: 'invalid',
				required: 'required'
			},
			email: {
				required: 'required',
				email: 'invalid'
			},
			message: 'required',
			minlength: 'required'
			},
		onkeyup: true,
		debug: true
	});
	
	//if validates to true, then submit it
	if ($('form.contact_form').valid() == true){						  
		var str = $('form.contact_form').serialize();
		$.ajax({
			type: 'post',
			url: 'http://miguelmota.webuda.com/contact/mailer.php',
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
		$('form.contact_form').slideUp(300);
		setTimeout(function(){
			$('form.contact_form').html('<p>Thank you.<br />Your message has been successfully sent!<br />I will get in touch with you soon.</p>').fadeIn(1200);	
		}, 300);
	}
	
}

function blogPage(){
	
	//initialize Google Search
	loadSearch();
	
	//initialize Disqus
	loadDisqus();
	
}

//load Google Search function
google.load('search', '1', {language : 'en'});
function loadSearch(){
	var customSearchControl = new google.search.CustomSearchControl('013110027163283765539:a-en5rcxdcu');
	customSearchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
	customSearchControl.draw('cse');
}