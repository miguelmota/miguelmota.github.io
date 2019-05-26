/*----------------------------------------
 *	jQuery awesome tooltip
 *	Author: Miguel Mota, www.miguelmota.com
 *	License: Creative Commons Attribution 3.0 License
----------------------------------------*/

(function($) {
	$.fn.awesometooltip = function() {
		$(this).each(function(){
			$(this).attr('awesometooltip',$(this).attr('title')).removeAttr('title');
			var title = $(this).attr('awesometooltip');
			$(this).wrap("<div class='tooltip-wrap' />");
			$(this).css('white-space','nowrap');
			$('div.tooltip-wrap').prepend("<div class='tooltip' />");
			$(this).hover(function() {
					$(this).prev().text(title).stop(true,true).animate({opacity: 'show', top: '-30'}, 'slow');
				}, function() {
					$(this).prev().animate({opacity: 'hide', top: '-20'}, 'fast');
			});	
		});
	}
})(jQuery);