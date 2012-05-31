/*
 *	mtippy - a jQuery tooltip plugin
 *	v1.0 - 20120525
 *	(c) 2012 Miguel Mota [www.miguelmota.com]
 *	Released under the MIT license
 */

(function($) {

	$.fn.mtippy = function(options) {
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
			positionTop: '-2.5em',
			textShadow: '0 -1px 0 rgba(0,0,0,.8)',
			showSpeed: 500,
			hideSpeed: 200,
			timeout: 200
		}

		options = $.extend(settings, options);

		return this.each(function() {
			var elem = $(this);

			if(!elem.attr('title')) return true;

			var scheduleEvent = new eventScheduler();
			var tip = new Tip(elem.attr('title'));

			elem.append(tip.generate()).addClass('mtippy-wrap');

			elem.hover(function() {

				tip.show();
				scheduleEvent.clear();

			}, function() {

				scheduleEvent.set(function() {
					tip.hide();
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

			$('.mtippy').css({
				'background': settings.backgroundColor,
				'border': '1px solid ' + settings.borderColor,
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
				'left': '50%',
				'line-height': '1',
				'opacity': settings.opacity,
				'-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha(Opacity='+settings.opacity * 10+')"',
				'filter': 'alpha(opacity='+settings.opacity * 10+')',
				'padding': settings.padding,
				'position': 'absolute',
				'text-align': 'center',
				'text-decoration': 'none',
				'text-shadow': settings.textShadow,
				'top': settings.positionTop,
				'white-space': 'nowrap'
			});

			$('.mtippy-tip, .mtippy-tip-shadow').css({
				'border': '6px solid transparent',
				'border-top-color': settings.borderColor,
				'bottom': '-12px',
				'height': '0',
				'left': '50%',
				'margin-left': '-6px',
				'position': 'absolute',
				'width': '0'
			});

			$('.mtippy-tip-shadow').css({
				'border-width': '7px',
				'border-top-color': settings.borderColor,
				'bottom': '-14px',
				'margin-left': '-7px'
			});

		});
	}

	function eventScheduler() {}

	eventScheduler.prototype = {
		set: function(func, timeout) {

			this.timer = setTimeout(func, timeout);

		},
		clear: function() {

			clearTimeout(this.timer);

		}
	}

	function Tip(txt) {
		this.content = txt;
		this.shown = false;
	}

	Tip.prototype = {

		generate: function() {

			return this.tip || (this.tip = $('<span class="mtippy">' + this.content + 
				'<span class="mtippy-tip-shadow"></span><span class="mtippy-tip"></span></span>'))

		},
		show: function() {
			if(this.shown) return;

			this.tip.css('margin-left', -this.tip.outerWidth()/2).stop(true,true).animate({opacity: 'show', top: '-3em'}, 400);
			this.shown = true;

		},
		hide: function() {
			this.tip.animate({opacity: 'hide', top: '-2.5em'}, 200);
			this.shown = false;
		}

	}



})(jQuery);



