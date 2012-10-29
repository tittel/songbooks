// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'collections/search-collection', 'text!templates/search-result-template.html', 'views/error-view'],
	function($, _, Backbone, state, searchCollection, searchListTemplate, ErrorMessage) {
		var SearchResultView = Backbone.View.extend({
			el : "#content",
			collection : searchCollection,
			initialize : function() {
				_.bindAll(this, "render", "queryChanged", "songbookChanged"); // remember: every function that uses 'this' as the current object should be in here
		        state.bind("change:query", this.queryChanged);
		        state.bind("change:songbookId", this.songbookChanged);
			},
			render : function() {
				state.set("viewState", "search");
				this.$el.text("Loading...");

				var that = this;
				this.collection.fetch({
					success: function(songs) {

						// if exactly one song in results, directly display it
						if (songs.models.length == 1) {
							Backbone.history.navigate("songs/" + songs.models[0].id, true);
						}
						else {
							var compiledTemplate = _.template(searchListTemplate, { songs : songs.models, _ : _ });
							$(that.el).html(compiledTemplate);
						}
						$(".query").focus();
					},
					error: function(model, response) {
						new ErrorMessage({ message : "Error searching songs: " + response.status + " (" + response.statusText + ")" });
						Backbone.history.navigate("", true);
					}
				});
			},
			queryChanged : function() {
				console.log("query changed");
				if (state.get("query").length > 0) {
					Backbone.history.navigate(this.collection.url().replace(".json", ""), {trigger:true});
				}
			},
			songbookChanged : function() {
				console.log("songbook changed");
				if (state.get("viewState") == "search") {
					this.queryChanged();
				}
			}
		});
		return new SearchResultView;
	}
);