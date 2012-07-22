// BLOG SCRIPTS

$(document).ready(function(){

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


		// Display the "show more" button if post text is more than 408 pixels
		$('.blog-post-grid .blog-post-text').each(function() {
			if($(this).height() <= 408) {
				$(this).next().hide();
				$(this).next().next().hide();
			}
			else {
				$(this).animate({'height': 408}, 0);
				$('.blog-view-post-wrap').toggle(
					function() {
						$(this).prevUntil('.blog-post-grid', '.blog-post-text').animate({'height': '100%'}, 200);
						$(this).prev().hide();
						$(this).html("show less <span class='arrow'>^</span>");
					},
					function() {
						$(this).prevUntil('.blog-post-grid', '.blog-post-text').animate({'height': 408}, 200);
						$(this).prev().show();
						$(this).html("show more <span class='arrow'>&#8250;</span>");
					}
				);
			}
		});


		
		
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
			
});

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