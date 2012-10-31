define([ 'Underscore', 'Backbone' ], function(_, Backbone) {
	var SongbookModel = Backbone.Model.extend({
		defaults : {
			"name" : "",
			"author" : "",
			"properties": {}
		},
		initialize : function() {
		},
		urlRoot: "api/songbook/"
	});
	return SongbookModel;
});