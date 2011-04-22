/***************************/
//@Author: Miguel Mota
//@website: www.miguelmota.com
//@email: hello@miguelmota.com
//@license: Feel free to use it, but keep these credits please!					
/***************************/
(function($) {
	$.fn.mtip = function(options) {
		var settings = {
				'background-color': '#000'
		};
		return this.each(function() {
			if(options) {
				$.extend(settings, options)
			}
			$(this).wrap('<div class="tooltip_container" />');	
			$(this).hover(function() {
						$(this).after("<div class='tooltip'></div>");
						//$(this).attr('mtip', $(this).attr('title')).removeAttr('title');
						//$(this).attr('mtip', $(this).attr('mtip')); //alt^
						var title = $(this).attr('title');
						$('div.tooltip').text(title).hide().css('background-color', '#000');
						$('div.tooltip').css('visibility', 'visible');
						jQuery(this).next('div.tooltip').stop(true, true).animate({opacity: 'show', top: '-30'}, 'slow');
				}, function() {
						jQuery(this).next('div.tooltip').animate({opacity: 'hide', top: '-20'}, 'fast');
						//$(this).attr('title', $(this).attr('mtip'));
			});
		});
	}
})(jQuery);
