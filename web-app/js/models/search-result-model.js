define([ 'Underscore', 'Backbone', 'models/appstate' ], function(_, Backbone, state) {
	var SearchResultModel = Backbone.Model.extend({
		defaults : {
			"total" : 0,
			"size" : 0,
			"results": []
		},
		initialize : function() {
		},
		url: function() {
			var songbookParam = (state.get("r") && state.get("songbookId")) ? "&songbookId=" + state.get("songbookId") : "";
			return "api/search.json?q=" + state.get("query") + songbookParam;
		}
	});
	return SearchResultModel;
});