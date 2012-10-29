define([ 'Underscore', 'Backbone' ], function(_, Backbone) {
	var SongbookModel = Backbone.Model.extend({
		defaults : {
			"name" : "",
			"author" : "",
			"properties": {}
		},
		initialize : function() {
		},
		url: function() {
			return "api/songbook/" + this.id + ".json";
		}
	});
	return SongbookModel;
});