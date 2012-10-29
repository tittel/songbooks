define([ 'Underscore', 'Backbone' ], function(_, Backbone) {
	var SongModel = Backbone.Model.extend({
		defaults : {
			"name" : "unspecified",
			"author" : "unspecified",
			"fragment" : "",
		},
		initialize : function() {
		},
	});
	return SongModel;
});