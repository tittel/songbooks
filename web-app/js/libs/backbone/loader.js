define(['order!libs/jquery/jquery-1.8.2.min',
        'order!libs/jquery/jquery-ui-1.9.1.custom.min',
        'order!libs/bootstrap/bootstrap.min',
		'order!libs/underscore/underscore-min',
		'order!libs/backbone/backbone-min'], function() {
	return {
		Backbone : Backbone.noConflict(),
		_ : _.noConflict(),
		$ : jQuery.noConflict()
	};
});
