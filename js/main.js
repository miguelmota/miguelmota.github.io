//main.js

var MM = MM || (function() {

	return {
		initialize: function() {
			$(document).foundation();
		}
	}

})();

$(document).ready(function() {
	MM.initialize();
});

$(document).on('click', '.input-short-url', function() {
	$(this).select();
})