define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'collections/songbooks-collection', 'text!templates/songbook-select-template.html', 'views/error-view' ],
	function($, _, Backbone, state, songbooksCollection, songbookSelectTemplate, ErrorMessage) {
		var SongbookSelectView = Backbone.View.extend({
			collection : songbooksCollection,
			initialize : function() {
				_.bindAll(this, "render", "songbookChanged");
		        state.bind("change:songbookId", this.songbookChanged);
		        $("<select id='select-songbook'/>").appendTo($(this.el));
		        this.render();
		    },
		    events : {
		        "change #select-songbook": "selectSongbook",
		    },
			render : function() {
				var that = this;
				this.collection.fetch({
					success: function(songbooks) {
						var compiledTemplate = _.template(songbookSelectTemplate, { songbooks : songbooks.models, currentSongbookId : state.get("songbookId"), _ : _ });
						$("#select-songbook", $(that.el)).html(compiledTemplate);
	
						// erase stale state from local storage
						if ($("#select-songbook option:selected").length == 0) {
							that.selectSongbook();
						}
					},
					error: function(model, response) {
						new ErrorMessage({ message : "<strong>Error loading songbooks</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
					}
				});
			},
			selectSongbook : function() {
				state.set("songbookId", $("#select-songbook").val());
			},
			songbookChanged : function() {
				localStorage["songbookId"] = $("#select-songbook").val();
				this.render();
			}
		});
		return SongbookSelectView;
	}
);
