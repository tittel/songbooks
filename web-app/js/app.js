define([ 'jQuery', 'Underscore', 'Backbone', 'router' ], function($, _, Backbone, Router) {
	var initialize = function() {
		// Pass in our Router module and call it's initialize function
		Router.initialize();
		// init ajax loading spinner
		$(document).ajaxStart(function() {
			$("#spinner").fadeIn();
		}).ajaxStop(function() {
			$("#spinner").fadeOut();
		});
	};
	return {
		initialize : initialize
	};
});