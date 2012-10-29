define(['order!libs/jquery/jquery-min',
        'order!libs/jquery/jquery-ui-1.8.23.custom.min',
		'order!libs/underscore/underscore-min',
		'order!libs/backbone/backbone-min',
		'order!libs/fg.menu'], function() {
	return {
		Backbone : Backbone.noConflict(),
		_ : _.noConflict(),
		$ : jQuery.noConflict()
	};
});
