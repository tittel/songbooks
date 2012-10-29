define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'models/song-meta-model' ], function($, _, Backbone, state, SongMetaModel) {
	var SearchCollection = Backbone.Collection.extend({
		model : SongMetaModel,
		initialize : function() {
		},
		url : function () {
			var songbookParam = state.get("songbookId") ? "&songbookId=" + state.get("songbookId") : "";
			var restrictParam = state.get("r") ? "" : "&r=false";
			return "api/search.json?q=" + state.get("query") + songbookParam + restrictParam;
		},
		// Because backend doesn't return an array of models by default we need to point Backbone.js at the correct property
		parse : function(resp, xhr) {
			return resp.results;
		}
	});
	return new SearchCollection;
});