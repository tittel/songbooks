// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'collections/songbook-songs-collection', 'text!templates/songbook-songs-template.html', 'views/error-view'],
	function($, _, Backbone, state, songbookSongsCollection, template, ErrorMessage) {
		var SongbookSongsView = Backbone.View.extend({
			collection : songbookSongsCollection,
			initialize : function() {
				_.bindAll(this, "render", "filterChanged", "songbookChanged"); // remember: every function that uses 'this' as the current object should be in here
		        state.bind("change:filter", this.filterChanged);
		        state.bind("change:songbookId", this.songbookChanged);
		        this.render();
			},
			render : function() {
				$(this.el).empty();
				
				if (state.get("songbookId")) {
					var that = this;
					this.collection.fetch({
						success: function(collection) {
							var compiledTemplate = _.template(template, { songs:collection.models, _ : _ });
							$(that.el).html(compiledTemplate);
					        state.channel.trigger("songbookSongsCollectionChanged");
						},
						error: function(model, response) {
							new ErrorMessage({ message : "<strong>Error loading songs</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
						}
					});
				}
			},
			filterChanged : function() {
				// TODO: implement
			},
			songbookChanged : function() {
				this.render();
			}
		});
		return SongbookSongsView;
	}
);