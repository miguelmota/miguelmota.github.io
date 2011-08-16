$(document).ready(function(){
	
	// Open external links in new tab
	$('a[href^=http]').live('click', function(){
		window.open(this.href);
		return false;
	});
	
	$('ul.nav li a, ul.contact li a').contents().wrap("<span class='text' />").end().append("<span class='rsaquo'>&#8250;</span>");

	$('#stream div.content').load('/stream section.content', function(){
		streamPage();	
		$('a.social').append("<span class='rsaquo'>&#8250;</span>");
	});
			
	$('#about div.content').load('/about section.content');
	$('#portfolio div.content').load('/portfolio/miggs section.content', function(){
		$('div.work-image:not(:first)', this).hide();
		
		$('div.work-description', this).appendTo('div.work');
		
		$(this).append("<div class='foodfail' />");

		
		$('div.foodfail').load('/portfolio/foodfail section.content', function(){
			
			$('div.foodfail').after("<div class='miguelmota' />");
			
			$('div.foodfail div.work-image:not(:first)').hide();
			
			$('div.foodfail div.work-description').appendTo('div.foodfail div.work');
			
				$('div.miguelmota').load('/portfolio/miguelmota section.content', function(){
					
					$('div.miguelmota div.work-image:not(:first)').hide();
					
					$('div.miguelmota div.work-description').appendTo('div.miguelmota div.work');
					
					
					
				});
			
		});
		
		
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
	
	$('#blog div.content').load('/blog section.content', function(){
		
		// Initialize Twitter widgets
		$.getScript('http://platform.twitter.com/widgets.js');
		
		$('div.share-container').prepend("<g:plusone class='plus-one-button' href='http://www.miguelmota.com{{ post.url }}' size='medium'></g:plusone>");
		
		// Initiatlize Google Plus One
		(function() {
			  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			  po.src = 'https://apis.google.com/js/plusone.js';
			  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
			})();
		
		loadDisqus();
		
		
		
		
		var link = $('#blog h1 a').attr('href');
		$('#blog h1 a').attr('href', '#article').removeAttr('rel').live('click', function(){
			
			
			
			$('#article div.content').load('/article/make-an-awesome-tooltip-with-jquery/ section.content', function(){
				//initialize Disqus
				loadDisqus();
			});
		
			
		});
		
		
		
		$('#blog div.view_archive a').attr('href', '#archive').removeAttr('rel');
		$('#archive div.content').load('/archive section.content');
	});

	$('div.page').prepend("<div class='footer'>&#169; "+thisYear+" <a href='https://plus.google.com/102174577273194387652?rel=author' rel='author'>miguel mota</a> / powered by <a href='http://jqtouch.com/'>jQTouch</a></div>");


	

	
	
	setTimeout(function(){
		$("div#home div.toolbar a, div.content a:not('a.fancybox'), a#standard_view").attr('rel', 'external');
	}, 5000);

	
	



});

var date = new Date();
var thisYear = date.getFullYear();


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
		
		// Twitter stream
		$('div.twitter div.loader').css('display','block');
		$.getJSON('http://twitter.com/status/user_timeline/miguel_mota.json?&count=5&callback=?', 
				function(data){
					$.each(data, function(i, status){
						var post = status.text;
						var id = status.id_str;
			    	  	var date = new Date(status.created_at).toUTCString();
				        var newText = '<span>'+post.split(' ').join('</span> <span>')+'</span>';
			    	  	$('ul.twitter-status').append("<li id='"+id+"' class='status'>&#187; <span class='post'>"+newText+"</span> <span class='date'><a href='http://twitter.com/miguel_mota/status/"+id+"'>"+niceTime(date)+"</a></span></li>");
			    	    $("li.status[id='"+id+"'] span").find(":contains('http')").wrapInner("<a href='"+$("li.status[id='"+id+"'] span").find(":contains('http')").text()+"'> </a>");
			    	    $("li.status[id='"+id+"'] span").find(":contains('@')").wrapInner("<a href='http://twitter.com/"+$("li.status[id='"+id+"'] span").find(":contains('@')").text().substr(1)+"'> </a>");
					});
					$('div.twitter div.loader').css('display','none');
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
			}
		);

	
}

