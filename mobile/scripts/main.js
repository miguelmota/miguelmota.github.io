$(document).ready(function(){
	


	$('#stream div.content ul li.arrow').load('/stream section.content', function(){
		streamPage();	
	});
			
	$('#about div.content ul li.arrow').load('/about section.content');
	$('#portfolio div.content ul li.arrow').load('/portfolio section.content', function(){
		//initialize fancybox
		/*$('a.fancybox').fancybox({
			'padding': 0,
			'margin': 0,
			'transitionIn': 'none',
			'transitionOut': 'none',
			'speedIn': 0, 
			'speedOut': 0, 
			'overlayColor': '#000',
			'hideOnContentClick': true
		});*/
	});
	$('#blog div.content ul li.arrow').load('/blog section.content', function(){
		loadDisqus();
	});



	

	
	
	setTimeout(function(){
		$("div#home div.toolbar a, div.content ul li.arrow a:not('a.fancybox'), a#standard_view").attr('rel', 'external');
	}, 5000);

	
	
	$('#blog div.content h3 a').live('click', function(){
		//initialize Disqus
		loadDisqus();
		
		$('#blog div.content ul li.arrow').load($(this).attr('href')+' section.content');
		return false;
	});


});

var jQt = $.jQTouch({
	icon: '/images/apple-touch-icon.png',
	addGlossToIcon: false,
	statusBar: 'black',
	startupScreen: '/images/startup.png',
	preloadImages: []
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
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(s);
    }());
}

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





function streamPage(){
	
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
			    	  		else{
			    	  			$('ul.facebook_status').append("<li class='status'>&#187; Link: <a href='"+link+"'>"+name+"</a></span> <span class='date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
			    	  		}
				    	    break;
			    	  	case 'video':
			    	  		if(post){
			    	  			$('ul.facebook_status').append("<li class='status'>&#187; Video: <span class='post'>"+post+" <a href='"+link+"'>"+name+"</a></span> <span class='date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
			    	  		}
			    	  		else{
					    	    $('ul.facebook_status').append("<li class='status'>&#187; Video: <span class='post'><a href='"+link+"'>"+name+"</a></span> <span class='date'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>"+niceTime(date)+"</a></span></li>");
			    	  		}
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

	
	
}




/*
function streamPage(){
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
			    	    $('ul.facebook_status').append("<li class='arrow'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'><span class='post'>"+post+"</span></a><span class='date'>"+niceTime(date)+"</span></li>");
			    	    break;
		    	  	case 'link':
		    	  		if(post){
		    	  			$('ul.facebook_status').append("<li class='arrow'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'><span class='post'>Link: "+post+" "+name+"</a></span><span class='date'>"+niceTime(date)+"</span></li>");
		    	  		}
		    	  		else {
		    	  			$('ul.facebook_status').append("<li class='arrow'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>Link: "+name+"</a></span><span class='date'>"+niceTime(date)+"</span></li>");
		    	  		}
			    	    break;
		    	  	case 'video':
			    	    $('ul.facebook_status').append("<li class='arrow'><a href='http://www.facebook.com/miguel.mota2/posts/"+post_id+"'>Video: <span class='post'>"+post+" "+name+"</span></a><span class='date'>"+niceTime(date)+"</span></li>");
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
		    	    $('ul.twitter_status').append("<li class='arrow'><a href='http://twitter.com/miguel_mota/status/"+id+"'><span class='post'>"+post+"</span></a><span class='date'>"+niceTime(date)+"</span></li>");
				});
				$('div.twitter img.loader').css('display','none');
				$("a:not('a[href^='#']')").attr('target','_blank');
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
			        $('ul.tumblr_posts').append("<li class='arrow'><a href='"+url+"'>"+slug.substring(0,1).toUpperCase()+slug.substr(1,200)+"</a><span class='date'>"+niceTime(date)+"</span></li>");
			      }); 
				  $('div.tumblr img.loader').css('display','none');
				  $("a:not('a[href^='#']')").attr('target','_blank');
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
					$('ul.delicious_bookmarks').append("<li class='arrow'><a href='"+url+"'>"+title+"</a><span class='date'>"+niceTime(date)+"</span></li>");
				});
				$('div.delicious img.loader').css('display','none');
				$("a:not('a[href^='#']')").attr('target','_blank');
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
						$('ul.lastfm_tracks').append("<li class='arrow'><a href='"+url+"'>"+artist+" - "+name+"</a><span class='date'>"+date+"</span></li>");
				}); 
				$('div.lastfm img.loader').css('display','none');
				$("a:not('a[href^='#']')").attr('target','_blank');
			}
	);
	$('div.wakoopa img.loader').css('display','block');
	$.getJSON('http://api.wakoopa.com/miguelmota/recently_used.json?limit=3&callback=?', 
		function wakoopaApi(data){
			var html = ["<ul class='wakoopa_software plastic'><li class='forward'><a href='http://social.wakoopa.com/miguelmota'>Wakoopa <span class='sub'>miguelmota</span></a></li>"];
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
			html.push("<li class='arrow'><a href='", entry.complete_url, "'>", entry.name, "</a><span class='date'>"+niceTime(date)+"</span>", "</li>");
			}
			html.push("</ul>");
			document.getElementById('wakoopa_software').innerHTML = html.join("");
			$('div.wakoopa img.loader').css('display','none');
			$("a:not('a[href^='#']')").attr('target','_blank');
		}
	);
}
*/