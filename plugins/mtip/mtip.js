/***************************/
//@Author: Miguel Mota
//@website: www.miguelmota.com
//@email: hello@miguelmota.com
//@license: Feel free to use it, but keep these credits please!					
/***************************/
(function($) {
	$.fn.mtip = function() {
		$(this).wrap('<div class="tooltip_container" />');
		$(this).hover(function() {
					$(this).attr('mtip', $(this).attr('title')).removeAttr('title');
					var title = $(this).attr('mtip');
					$(this).after("<div class='tooltip'></div>");
					$('div.tooltip').text(title).hide();
					$('div.tooltip').css({
						'visibility': 'visible'
					});
					jQuery(this).next('div.tooltip').stop(true, true).animate({opacity: 'show', top: '-30'}, 'slow');
			}, function() {
					jQuery(this).next('div.tooltip').animate({opacity: 'hide', top: '-20'}, 'fast');
		});
	}
})(jQuery);
