define([ 'jQuery', 'Underscore', 'Backbone', 'models/songbook-model' ], function($, _, Backbone, SongbookModel) {
	var SongbooksCollection = Backbone.Collection.extend({
		model : SongbookModel,
		initialize : function() {
		},
		url: function() {
			return "api/songbook.json";
		}
	});
	return new SongbooksCollection;
});