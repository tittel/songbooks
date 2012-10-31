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
			var songbookParam = state.get("songbookId") ? "&songbookId=" + state.get("songbookId") : "";
			var restrictParam = state.get("r") ? "" : "&r=false";
			return "api/search.json?q=" + state.get("query") + songbookParam + restrictParam;
		}
	});
	return SearchResultModel;
});