define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'models/song-model', 'views/message-view', 'views/error-view', 'text!templates/menu-template.html', 'views/song-view', 'views/song-edit-view', 'views/songbook-view' ], function($, _, Backbone, state, SongModel, Message, ErrorMessage, menuTemplate, songView, songEditView, songbookView) {
	var MenuView = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, "render", "viewStateChanged", "songbookChanged");
	        state.bind("change:viewState", this.viewStateChanged);
	        state.bind("change:songbookId", this.songbookChanged);
	        this.render();
	    },
		render : function() {
			this.$el.html(_.template(menuTemplate));
			var that = this;
			$("li[id]", this.$el).each(function() {
				$(this).click(function (evt) {
					evt.preventDefault();
					var id = $(this).attr("id");
					if (id && !$(this).hasClass("disabled")) {
						// close menu
						that.$el.removeClass("open");
						if ("menu-songbook-edit" == id) {
							Backbone.history.navigate("songbook/" + state.get("songbookId"), true);
						}
						else if ("menu-song-add-remove" == id) {
							var isInSongbook = $.inArray(songView.model.get("id"), songbookView.model.get("songs")) > -1;
							if (isInSongbook) {
								songbookView.model.get("songs").remove(songView.model.get("id"));
							}
							else {
								songbookView.model.get("songs").push(songView.model.get("id"));
							}
							songbookView.model.save({
				        		success: function() {
				        			new Message({message:"Songbook updated."});
				        		},
								error: function(model, response) {
									new ErrorMessage({ message : "<strong>Error updating songbook</strong>\n<i>" + response.status + " (" + response.statusText + ")</i>\n" + response.responseText });
								}
				        	});
						}
						console.log("click ->" + $(this).attr("id"));
					}
					return false;
				});
			});
			// register delete button click
			$("#deleteButton", this.$el).click(function (evt) {
				songView.model.destroy({
	        		success: function() {
	        			new Message({message:"Song deleted."});
	        			window.history.back();
	        		},
					error: function(model, response) {
						new ErrorMessage({ message : "<strong>Error deleting song</strong>\n<i>" + response.status + " (" + response.statusText + ")</i>\n" + response.responseText });
					}
	        	});
			});
			this.songbookChanged();
		},
		viewStateChanged : function() {
			var view = state.get("viewState");
			var songbookId = state.get("songbookId");

			// update state of menu items related to songs
			if ("song" == view) {
				var isInSongbook = $.inArray(songView.model.get("id"), songbookView.model.get("songs")) > -1;
				console.log("isInSongbook -> " + isInSongbook);
				$("#menu-song-add-remove a", this.$el)
				.html(isInSongbook ? "<i class='icon-minus'></i> Remove from songbook" : "<i class='icon-plus'></i> Add to songbook")
				.css("display", songbookId ? "list-item" : "none");
			}
		},
		songbookChanged : function() {
			var songbookId = state.get("songbookId");
			// update state of menu items related to songbooks
			$("#menu-songbook-edit", this.$el).css("display", songbookId ? "list-item" : "none");
			$("#menu-songbook-export", this.$el).css("display", songbookId ? "list-item" : "none");
			// call viewStateChanged because some items depend on the selected songbook
			this.viewStateChanged();
		}
	});
	return MenuView;
});
