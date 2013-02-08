define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'models/song-model', 'views/message-view', 'views/error-view', 'text!templates/menu-template.html', 'views/song-view', 'views/song-edit-view' ], function($, _, Backbone, state, SongModel, Message, ErrorMessage, menuTemplate, songView, songEditView) {
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
			
			// TODO: this is a temporary fix for the twitter dropdown menu not working on iPad. remove after fix (version > 2.1.1)
			$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });
			
			$("li a:not([href])", this.$el).click(function (evt) {
				evt.preventDefault();
				var id = $(this).attr("id");
				if (id && !$(this).parent().hasClass("disabled")) {
					// close menu
					that.$el.removeClass("open");
					if ("menu-songbook-manage" == id) {
						Backbone.history.navigate("songbook/" + state.get("songbookId"), true);
					}
					else if ("menu-song-add-remove" == id) {
						var model = songView.model;
						// TODO: implement
					}
					else if ("menu-song-export" == id) {
						// don't use backbone router, let the browser request the PDF
						window.location.href = contextPath + "song/" + songView.model.get("id") + "/download";
					}
				}
				return false;
			});
			// register delete button click
			$("#songDeleteButton", this.$el).click(function (evt) {
				songView.model.destroy({
	        		success: function() {
	        			new Message({message:"Song deleted."});
	        			window.history.back();
	        		},
					error: function(model, response) {
						new ErrorMessage({ message : "<strong>Error deleting song</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
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
				// TODO: implement
				var containedInSongbook = false;
				$("#menu-song-add-remove", this.$el)
				.html(containedInSongbook ? "<i class='icon-minus'></i> Remove from songbook" : "<i class='icon-plus'></i> Add to songbook")
				.parent().css("display", songbookId ? "list-item" : "none");
				$("#menu-song-add-remove-container + li.divider", this.$el).css("display", songbookId ? "list-item" : "none");
			}
		},
		songbookChanged : function() {
			var songbookId = state.get("songbookId");
			// update state of menu items related to songbooks
			$("li>a#menu-song-add-remove", this.$el).css("display", songbookId ? "list-item" : "none");
			$("#menu-songbook-manage", this.$el).css("display", songbookId ? "list-item" : "none");
			// call viewStateChanged because some items depend on the selected songbook
			this.viewStateChanged();
		}
	});
	return MenuView;
});
