// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'models/search-result-model', 'text!templates/search-result-template.html', 'views/error-view'],
	function($, _, Backbone, state, SearchResultModel, searchListTemplate, ErrorMessage) {
		var SearchResultView = Backbone.View.extend({
			el : "#content",
			model : new SearchResultModel,
			initialize : function() {
				_.bindAll(this, "render", "queryChanged", "songbookChanged"); // remember: every function that uses 'this' as the current object should be in here
		        state.bind("change:query", this.queryChanged);
		        state.bind("change:songbookId", this.songbookChanged);
			},
			render : function() {
				state.set("viewState", "search");
				$(this.el).empty();

				var that = this;
				this.model.fetch({
					success: function(searchResult) {
						// if exactly one song in results, directly display it
						if (searchResult.get("results").length == 1) {
							Backbone.history.navigate("song/" + searchResult.get("results")[0].id, true);
						}
						else {
							var compiledTemplate = _.template(searchListTemplate, { total:searchResult.get("total"), size:searchResult.get("size"), results:searchResult.get("results"), _ : _ });
							$(that.el).html(compiledTemplate);
						}
						
						$(".query").focus();
					},
					error: function(model, response) {
						new ErrorMessage({ message : "<strong>Error searching songs</strong>\n<i>" + response.status + " (" + response.statusText + ")</i>\n" + response.responseText });
						Backbone.history.navigate("", true);
					}
				});
			},
			queryChanged : function() {
				if (state.get("query").length > 0) {
					Backbone.history.navigate(this.model.url().replace(".json", "").replace("api/", ""), {trigger:true});
				}
			},
			songbookChanged : function() {
				if (state.get("viewState") == "search") {
					this.queryChanged();
				}
			}
		});
		return new SearchResultView;
	}
);