// STREAM SCRIPTS

$(document).ready(function(){

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


		// Initialize mtippy
		//$('.mtip').mtippy();


		// Hide stream logo text
		//$(".stream-logo:not('.stream-logo-blog ,.stream-logo-latitude')").text('');
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
		// old json: https://twitter.com/status/user_timeline/miguel_mota.json?callback=?count=5
		$.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?callback=?', 
				{
					include_entities: true,
					include_rts: true,
					screen_name: 'miguel_mota',
					count: 5
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
		 * Github stream
		 * --------------------- */
		$('.stream-github .loader').css('display','block');
		$.getJSON('https://github.com/miguelmota.json?callback=?',
				function(data) {
					$('.stream-github').append('<ul class="stream-ul stream-ul-github">');
					var limit = 5;
					$.each(data, function(i, item) {
						if(i >= limit)
							return false;
						var pushed = item.repository["pushed_at"];
						var message = item.payload["shas"][0][2];
						var head = item.payload["head"];
						var name = item.repository["name"];
						var url = item["url"];
						var type = item["type"];
						var image = 'checkmark-2';
						if(type == "PushEvent") {
							type = 'pushed';
							image = 'up-arrow';
						}
						if(type == "PullEvent") {
							type = 'pulled';
							image = 'down-arrow';
						}

						var list_item = "<li><a href='"+url+"' rel='external'><img class='stream-thumb icon' src='/assets/site/icons/pictos/16/"+image+".png' alt='' /> <span class='stream-li-sub'>"+type+"</span> \""+message+"\" <span class='stream-li-sub'>to</span> "+name+" <time class='status-date' datetime=''>"+formattedDate(pushed)+"</time><span class='clear'></span></a></li>";
						$('.stream-ul-github').append(list_item);
					});
					$('.stream-ul-github').append('</ul>');
					$('.stream-ul-github li:nth-child(odd)').addClass('odd');

					$('.stream-github .loader').css('display','none');
					showMtipTimeout('.stream-logo-github',3000);
				}
		);



		/* ------------------------
		 * Foursquare stream
		 * --------------------- */
		$('.stream-foursquare .loader').css('display','block');
		$.getJSON('https://api.foursquare.com/v2/users/4418723/checkins?oauth_token=DATQU0DAPF0JA043XEXPOPH2FPHVQUM4YAEAQ0SRTWGZHQ43&v=20120522&callback=?',
				function(data) {
					$('.stream-foursquare').append('<ul class="stream-ul stream-ul-foursquare">');
					var limit = 5;
					$.each(data.response.checkins.items, function(i, item) {
						if(i >= limit)
							return false;
						var name = item.venue["name"];
						var city = item.venue["location"]["city"];
						var state = item.venue["location"]["state"];
						var url;
						if(item.venue["url"])
							url = item.venue["url"];
						else 
							url = 'https://foursquare.com/';

						var time = item.createdAt;
						var photo = item.venue["categories"][0]["icon"]["prefix"] + 
								   item.venue["categories"][0]["icon"]["sizes"][0] +
								   item.venue["categories"][0]["icon"]["name"];

						var list_item = "<li><a href='"+url+"' rel='external'><img class='stream-thumb' src='"+photo+"' alt='' /> "+name+" <span class='stream-li-sub'>in "+city+", "+state+"</span> <time class='status-date' datetime=''>"+formattedDate(time)+"</time><span class='clear'></span></a></li>";
						$('.stream-ul-foursquare').append(list_item);
					});
					$('.stream-ul-foursquare').append('</ul>');
					$('.stream-ul-foursquare li:nth-child(odd)').addClass('odd');

					$('.stream-foursquare .loader').css('display','none');
					showMtipTimeout('.stream-logo-foursquare',3000);
				}
		);



		/* ------------------------
		 * Facebook stream
		 * --------------------- */
		$('.stream-facebook .loader').css('display','block');	
		$('.stream-facebook').append('<ul class="stream-ul stream-ul-facebook">');
		$.getJSON('000https://graph.facebook.com/miguel.mota2/feed&access_token=136918436443248|h21SkstVPoahrXI4sN5kh2A051k&callback=?',
				function(data) {
					var limit = 3;
					$.each(data.data, function(i, item) {
						if(i >= limit)
							return false;

						var post_id = item.id.substr(16);
			    	  	var url = 'http://www.facebook.com/miguel.mota2';
			    	  	var date = new Date(item.created_time).toUTCString();

						var post;
						if(item.message) {
							post = item.message;
							url = url + '/posts/' + post_id;
						}
						if(item.story) {
							post = "<span class='stream-li-sub'>" + item.story + "</span>";
							url = url + '/allactivity';
						}
						if(item.link) {
							var link = item.link;
						}
						if(item.caption) {
							var caption = item.caption;
							post = post + "<span class='stream-li-sub'> | " + caption + "</span>";
						}
						if(item.description) {
							var description = item.description;
							post = post + "<span class='stream-li-sub'> - " + description + "</span>";
						}
						if(item.to) {
							var from = "<span class='stream-li-sub'>"+item.from.name + ":</span> ";
							post = from + post;
						}

			    	  	var type = item.type;
			    	  	if(type == 'status')
			    	  		type = 'text';
			    	  	if(type == 'link')
			    	  		type = 'link';
			    	  	if(type == 'photo')
			    	  		type = 'photo';
			    	  	if(type == 'video')
			    	  		type = 'video';

		    	  	  	var list_item = "<li><a href='"+url+"' rel='external'><span class='icon icon-"+type+"-16'></span> "+post+" <time class='status-date' datetime=''>"+formattedDate(date)+"</time><span class='clear'></span></a></li>";
		    	  		$('.stream-ul-facebook').append(list_item);
					});
					
					$('.stream-ul-facebook').append('</ul>');
					$('.stream-ul-facebook li:nth-child(odd)').addClass('odd');

					// Initialize timeago
					// $('.stream-ul-facebook .status-date').timeago();

					$('.stream-facebook .loader').css('display','none');
					showMtipTimeout('.stream-logo-facebook',3000);
				}
		);
		
		
		
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
				    	  	if (type == null)
				    	  	{
				    	  		type = 'tumblr';
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

				// Run Masonry
				loadMasonry();

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
		


	// Hide white flash on iframe load
	// Prevent variables from being global
	(function () {
	   
	    // 1. Inject CSS which makes iframe invisible
	    var div = document.createElement('div'),
	        ref = document.getElementsByTagName('base')[0] ||
	              document.getElementsByTagName('script')[0];

	    div.innerHTML = '&shy;<style> iframe { visibility: hidden; } </style>';

	    ref.parentNode.insertBefore(div, ref);

	    // 2. When window loads, remove that CSS, making iframe visible again
	    window.onload = function() {
	        div.parentNode.removeChild(div);
	    }

	})();

});

// Initialize Masonry plugin, masonry.desandro.com
function loadMasonry(){

	var $container = $('.content');
	
	if(window.width <= 640){
		$container = '';
	}
	
	$container.imagesLoaded(function(){
	  $container.masonry({
	  	itemSelector: '.stream-wrap',
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