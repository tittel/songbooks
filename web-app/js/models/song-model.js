define([ 'Underscore', 'Backbone' ], function(_, Backbone) {
	var SongModel = Backbone.Model.extend({
		defaults : {
			"text" : "",
		},
		initialize : function() {
		},
		urlRoot: "api/song/"
	});
	return SongModel;
});