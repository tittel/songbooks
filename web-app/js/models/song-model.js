define([ 'Underscore', 'Backbone', 'models/appstate' ], function(_, Backbone, state) {
	var SongModel = Backbone.Model.extend({
		defaults : {
			"text" : "",
			"containedInSongbook" : false
		},
		initialize : function() {
		},
		urlRoot: "api/song/",
		url : function() {
			var url = Backbone.Model.prototype.url.call(this);
			if (state.get("songbookId")) {
				url += "?songbookId=" + state.get("songbookId");
			}
			return url;
		}
	});
	return SongModel;
});