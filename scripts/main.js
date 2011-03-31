$(document).ready(function(){
	if(window.innerWidth <= 640){
		$('div#wrap').prepend("<a id='mobile_bar' href='/iphone/'>view mobile site</a><a id='mobile_close' href='javascript:void(0);'>x</a>");
		$('a#mobile_close').live('click', function(){
			$(this).hide();
			$('a#mobile_bar').slideUp('normal');
		});
	}
	$('div#ie a#close').click(function(){
		$('div#ie').slideUp('normal');
	});
	$('body').fadeIn(650, function(){
		$('div#ie').slideDown('slow');
	});
	textticker();
	if(window.location.hash == '') {
		//streamPage();
	}
	if(window.location.hash == '#!') {
		//window.location = '/';
	}
	$('nav.main a#logo').live('click', function(){
		$('nav.main a').removeClass('selected');
		$('nav.main a#stream').addClass('selected');
	});
	$('body').append("<div class='theTitle' style='display: none;'> &#8212; Miguel Mota | Freelance Web Developer</div>");
	var path = window.location.pathname.substring(1);
	if(window.location.hash){
		loadPage();
	}
	else {
		redirectPath();
	}
	function loadPage(){
		var toLoad = window.location.hash.substr(10)+' section.content';
		window.location.hash = window.location.hash.substr(1);
		$('section.content').fadeOut('fast',loadContent);
		$('div.loader').fadeIn('normal');
		function loadContent(){
			$('section.content').load(toLoad,showNewContent);
		}
		return false;
	}
	function redirectPath(){
		window.location = './#!'+path;
	}
});
var c = 0;
$(document).ajaxComplete(function(){
	var hash = window.location.hash.substr(2);
	switch(hash){
	case '':
	case 'stream':
		streamPage();
		break;
	case 'portfolio':
		portfolioPage();
		break;
	case 'contact':
		contactPage();
		break;
	default:
		break;
}
});
$("nav.main a:not('a#blog')").live('click', function(){
	c = 0;
	var toLoad = $(this).attr('href')+' section.content';
	window.location.hash = '!'+$(this).attr('href').substr(27,$(this).attr('href').length);
	$('section.content').fadeOut('fast',loadContent);
	$('div.loader').fadeIn('normal');
	function loadContent(){
		$('section.content').load(toLoad,showNewContent);
	}
	return false;
});
var position = 0;
var length = 'portfolio'.length;
function textticker(){
	$('a#stream').html('stream'.substring(0,position));
	$('a#about').html('about'.substring(0,position));
	$('a#portfolio').html('portfolio'.substring(0,position));
	$('a#contact').html('contact'.substring(0,position));
	$('a#blog').html('blog'.substring(0,position));
	if(position++ == length){
		setTimeout('textticker()',1000);
	} else
		setTimeout('textticker()',60);
}
function showNewContent(){
	$('nav.main a').removeClass('selected');
	$('#'+window.location.hash.substr(2)).addClass('selected');
	$('section.content, footer.main').fadeIn('normal',hideLoader);
	var title = $('span.sub').text()+$('div.theTitle').text();
	document.title = title;
	if(window.location.hash == '#!'){
		document.title = theTitle;
	}
}
function hideLoader(){
	$('div.loader').hide();
}
function streamPage(){
	$('.mtip').mtip();
	while(c == 0){
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
		$('div.twitter img.loader').css('display','block');
		$.getJSON('http://twitter.com/status/user_timeline/miguel_mota.json?&count=5&callback=?', 
				function(data){
					$.each(data, function(i, status){
						var post = status.text;
						var id = status.id_str;
			    	  	var date = new Date(status.created_at).toUTCString();
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
				        var newText = '<span>'+post.split(' ').join('</span> <span>')+'</span>';
			    	  	$('ul.twitter_status').append("<li id='"+id+"' class='status'>&#187; <span class='post'>"+newText+"</span> <span class='date'><a href='http://twitter.com/miguel_mota/status/"+id+"'>"+niceTime(date)+"</a></span></li>");
			    	    $("li.status[id='"+id+"'] span").find(":contains('http')").wrapInner("<a href='"+$("li.status[id='"+id+"'] span").find(":contains('http')").text()+"'> </a>");
					});
					$('div.twitter img.loader').css('display','none');
				}
		);
		$('div.tumblr img.loader').css('display','block');
		$.getJSON('http://miguelmota.tumblr.com/api/read/json?num=3&callback=?', 
				function(data){
					$.each(data.posts, function(i, posts){ 
				    	  	var date = new Date(this['date-gmt']).toUTCString();
				    	  	var url = this.url;
				    	  	var caption = this['photo-caption'];
				    	  	var slug = this.slug.replace(/-/g,' ');
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
				        $('ul.tumblr_posts').append("<li>&#187; <a href='"+url+"'>"+slug.substring(0,1).toUpperCase()+slug.substr(1,200)+"</a> <span class='date'>"+niceTime(date)+"</span></li>");
				      }); 
					  $('div.tumblr img.loader').css('display','none');
				  }
		);
		$('div.delicious img.loader').css('display','block');
		$.getJSON('http://feeds.delicious.com/v2/json/miguelmota/?count=3&callback=?', 
				function(data){
					$.each(data, function(i, item){
						var title = item.d;
						var url = item.u;
			    	  	var date = new Date(item.dt).toUTCString();
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
						$('ul.delicious_bookmarks').append("<li>&#187; <a href='"+url+"'>"+title+"</a> <span class='date'>"+niceTime(date)+"</span></li>");
					});
					$('div.delicious img.loader').css('display','none');
			}
		);
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
		$('div.wakoopa img.loader').css('display','block');
		$.getJSON('http://api.wakoopa.com/miguelmota/recently_used.json?limit=3&callback=?', 
			function wakoopaApi(data){
				var html = ["<ul class='wakoopa_software'>"];
				for(var i = 0; i < data.length; i++){
				var entry = data[i].software;
				var date = new Date(entry.last_active_at).toUTCString();
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
}
function refreshStream(){
	setTimeout(function(){
		if(window.location.hash.substr(2) == 'stream' || window.location.hash.substr(1) == ''){
			$('a#stream').trigger('click');
		}
	},30000);
}
function portfolioPage(){
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
	$('form.contact_form a.submit').live('click', function(){
		$.validator.addMethod('namecheck', function(value, element){
			return this.optional(element) || /^[a-zA-Z]+?\s?[a-zA-Z]+?\s?[a-zA-Z]+$/.test(value);
		});
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
		function success(){
			$('form.contact_form').slideUp(300);
			setTimeout(function(){
				$('form.contact_form').html('<p>Thank you.<br />Your message has been successfully sent!<br />I will get in touch with you soon.</p>').fadeIn(1200);	
			}, 300);
		}
}