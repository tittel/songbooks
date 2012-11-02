define([ 'Underscore', 'Backbone' ], function(_, Backbone) {
	var AppState = Backbone.Model.extend({
		defaults : {
			"songbookId" : localStorage["songbookId"] || "",
			"query" : "",
			"r" : localStorage["r"] ? Boolean(localStorage["r"]) : true,
			"viewState" : null,
			"columns" : localStorage["columns"] ? parseInt(localStorage["columns"]) : 1,
			"zoom" : localStorage["zoom"] ? parseFloat(localStorage["zoom"]) : 1
		},
		initialize : function() {
		},
		channel : _.extend({}, Backbone.Events)
	});
	return new AppState;
});