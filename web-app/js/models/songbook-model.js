define([ 'Underscore', 'Backbone' ], function(_, Backbone) {
	var SongbookModel = Backbone.Model.extend({
		defaults : {
			"name" : "",
			"author" : "",
			"props": {},
			"songs" : []
		},
		initialize : function() {
		},
		urlRoot: "api/songbook/"
	});
	return SongbookModel;
});