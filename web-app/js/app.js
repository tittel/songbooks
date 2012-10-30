// Filename: app.js
define([ 'jQuery', 'Underscore', 'Backbone', 'router' ], function($, _, Backbone, Router) {
	var initialize = function() {
		// Pass in our Router module and call it's initialize function
		Router.initialize();
		// init ajax loading spinner
		$('#spinner').ajaxStart(function() {
			console.log("ajax start");
			$(this).fadeIn();
		}).ajaxStop(function() {
			console.log("ajax stop");
			$(this).fadeOut();
		});
	};
	return {
		initialize : initialize
	};
});