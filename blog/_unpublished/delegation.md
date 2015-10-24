function addListener(obj, evt, fn, capture) {
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, (capture || false));
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + evt, fn);
	}
}

addListener(document, 'DOMContentLoaded', function(e) {
	MM.initialize();
});

addListener(document, 'click', function(e) {
	var e = e.target || window.event.srcElement;
	var classes = e.className.split(' ');
	if (classes) {
		for (var i = 0; i < classes.length; i++) {
			if (e.className[i] == 'input-short-url') {
				e.select();
			}
		}
	}
},true);
