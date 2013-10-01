/*
 *	mtippy - a jQuery tooltip plugin
 *	v1.0.0 - 20120525
 *	(c) 2012 Miguel Mota http://www.miguelmota.com
 *	Released under the MIT license
 */

(function($) {

	var methods = {
		init: function(options) {

			var settings = {
				backgroundColor: '#000',
				borderColor: '#000',
				borderRadius: '.5em',
				boxShadow: '.1em .1em .5em #000',
				color: '#fff',
				fontFamily: 'Helvetica, Arial, sans-serif',
				fontSize: '12px',
				fontStyle: 'normal',
				fontWeight: 'normal',
				opacity: 1,
				padding: '.8em 1.2em',
				positionLeft: '50%',
				positionTop: '-2.5em',
				textShadow: '0 -1px 0 rgba(0,0,0,.8)',
				showSpeed: 400,
				hideSpeed: 200,
				timeout: 600
			};

			options = $.extend(settings, options);

			return this.each(function() {

				var elem = $(this);

				if(!elem.attr('title')) return true;

				elem.append($('<span class="mtippy">' + elem.attr('title') +
							'<span class="mtippy-tip-shadow"></span><span class="mtippy-tip"></span></span>')).addClass('mtippy-wrap');

				var t;

				elem.hover(function() {

					$('.mtippy', elem).css('margin-left', -$('.mtippy', elem).outerWidth()/2).stop(true,true).animate({opacity: 'show', top: '-3em'}, settings.showSpeed);

					clearTimeout(t);

				}, function() {

					t = setTimeout(function() {

						$('.mtippy', elem).animate({opacity: 'hide', top: '-2.5em'}, settings.hideSpeed);

					}, settings.timeout);

				});

				elem.removeAttr('title');

				/*
				 * css styles
				 */

				$('.mtippy-wrap').css({
					'position': 'relative',
					'text-decoration': 'none'
				});

				$('.mtippy', this).css({
					'background': settings.backgroundColor,
					'border': '1px solid ' + settings.backgroundColor,
					'border-radius': settings.borderRadius,
					'-moz-border-radius': settings.borderRadius,
					'-webkit-border-radius': settings.borderRadius,
					'box-shadow': settings.boxShadow,
					'-moz-box-shadow': settings.boxShadow,
					'-webkit-box-shadow': settings.boxShadow,
					'color': settings.color,
					'display': 'none',
					'font-family': settings.fontFamily,
					'font-size': settings.fontSize,
					'font-style': settings.fontStyle,
					'font-weight': settings.fontWeight,
					'left': settings.positionLeft,
					'line-height': '1',

					'opacity': settings.opacity + ' !important',
					/* IE opacity
					'-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha(Opacity='+settings.opacity * 10+')"',
					'filter': 'alpha(opacity='+settings.opacity * 10+')',
					*/
					'padding': settings.padding,
					'position': 'absolute',
					'text-align': 'center',
					'text-decoration': 'none',
					'text-shadow': settings.textShadow,
					'top': settings.positionTop,
					'white-space': 'nowrap'
				});

				$('.mtippy-tip, .mtippy-tip-shadow', this).css({
					'border': '.5em solid transparent',
					'border-top-color': settings.backgroundColor,
					'bottom': '-1em',
					'height': '0',
					'left': settings.positionLeft,
					'margin-left': '-.5em',
					'position': 'absolute',
					'width': '0'
				});

			});

		},
		show: function() {
			$(this).trigger('mouseenter');
		},
		hide: function() {
			$(this).trigger('mouseleave');
		}

	};

	$.fn.mtippy = function(method) {

		  // Method calling logic
		  if ( methods[method] ) {
		    return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		  } else if ( typeof method === 'object' || ! method ) {
		    return methods.init.apply( this, arguments );
		  } else {
		    $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		  }

	}

})(jQuery);



