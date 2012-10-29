define([ 'jQuery', 'Underscore', 'Backbone', 'models/song-model' ], function($, _, Backbone, SongModel) {
	var SongCollection = Backbone.Collection.extend({
		model : SongModel,
		initialize : function() {
		}
	});
	return SongCollection;
});