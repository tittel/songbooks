define([ 'jQuery', 'Underscore', 'Backbone', 'models/song-meta-model','models/appstate' ], function($, _, Backbone, SongMetaModel, state) {
	var SongbookSongsCollection = Backbone.Collection.extend({
		model : SongMetaModel,
		initialize : function() {
		},
		url: function() {
			return "api/songbook/" + state.get("songbookId") + "/song";
		}
	});
	return new SongbookSongsCollection;
});