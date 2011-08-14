/*----------------------------------------
 *	mtip jQuery tooltip plugin
 *	v1.0 | 20100524
 *	Author: Miguel Mota, www.miguelmota.com
 *	License: Creative Commons Attribution 3.0 License
----------------------------------------*/

(function($) {
	$.fn.mtip = function() {
		$(this).each(function(){
			$(this).attr('mtip', $(this).attr('title')).removeAttr('title');
			var title = $(this).attr('mtip');
			$(this).wrap("<div class='tooltip-container' />");

			$(this).hover(function() {
				$('div.tooltip-container').prepend("<div class='tooltip' />");
						$('div.tooltip').text(title);
						$('div.tooltip').css({
							'visibility': 'visible'
						});
						jQuery(this).next('div.tooltip').stop(true, true).animate({opacity: 'show', top: '-30'}, 'slow');
				}, function() {
						jQuery(this).next('div.tooltip').animate({opacity: 'hide', top: '-20'}, 'fast');
						$('div.tooltip', this).css({
							'visibility': 'hidden'
						});
			});	
		});

	}
})(jQuery);
