define([ 'Underscore', 'Backbone' ], function(_, Backbone) {
	var SongMetaModel = Backbone.Model.extend({
		defaults : {
			"name" : "NO NAME",
			"author" : "NO AUTHOR",
		},
		initialize : function() {
		},
	});
	return SongMetaModel;
});