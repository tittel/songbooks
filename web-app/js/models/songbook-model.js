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
			return "songbooks/" + this.id + ".json";
		}
	});
	return SongbookModel;
});