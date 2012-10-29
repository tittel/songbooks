define([ 'Underscore', 'Backbone' ], function(_, Backbone) {
	var AppState = Backbone.Model.extend({
		defaults : {
			"songbookId" : localStorage["songbookId"] || "",
			"query" : "",
			"r" : true,
			"viewState" : null,
			"columns" : localStorage["columns"] ? parseInt(localStorage["columns"]) : 1,
			"fontsize" : localStorage["fontsize"] ? parseFloat(localStorage["fontsize"]) : 1
		},
		initialize : function() {
		},
		channel : _.extend({}, Backbone.Events)
	});
	return new AppState;
});