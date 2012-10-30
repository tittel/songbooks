define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'collections/songbooks-collection', 'text!templates/songbook-select-template.html', 'views/error-view' ],
	function($, _, Backbone, state, songbooksCollection, songbookSelectTemplate, ErrorMessage) {
		var SongbookSelectView = Backbone.View.extend({
			collection : songbooksCollection,
			initialize : function() {
				_.bindAll(this, "render");
		        this.render();
		    },
		    events : {
		        "change #select-songbook": "selectSongbook",
		    },
			render : function() {
				var that = this;
				this.collection.fetch({
					success: function(songbooks) {
						var compiledTemplate = _.template(songbookSelectTemplate, { songbooks : songbooks.models, _ : _ });
						$(that.el).html(compiledTemplate);
	
						// pre-select songbook from app state
						var found = false;
					 	$("#select-songbook option").each(function() {
					 		if (state.get("songbookId") == $(this).val()) {
					 			$(this).prop("selected", "selected");
					 			found = true;
					 		}
					 	});
					 	if (!found) {
					 		that.selectSongbook();
					 	}
					},
					error: function(model, response) {
						new ErrorMessage({ message : "<strong>Error loading songbooks</strong>\n<i>" + response.status + " (" + response.statusText + ")</i>\n" + response.responseText });
					}
				});
			},
			selectSongbook : function() {
				console.log("select songbook event -> " + $("#select-songbook").val());
				localStorage["songbookId"] = $("#select-songbook").val();
				state.set("songbookId", $("#select-songbook").val());
			}
		});
		return SongbookSelectView;
	}
);
