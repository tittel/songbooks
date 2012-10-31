define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'views/message-view', 'views/error-view', 'text!templates/menu-template.html', 'models/song-model', 'views/song-view', 'views/song-edit-view' ], function($, _, Backbone, state, Message, ErrorMessage, menuTemplate, SongModel, songView, songEditView) {
	var MenuView = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, "render", "viewStateChanged");
	        state.bind("change:viewState", this.viewStateChanged);
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
						
						console.log("click ->" + $(this).attr("id"));
					}
					return false;
				});
			});
			// register delete button click
			$("#deleteButton", this.$el).click(function (evt) {
				console.log("DELETE!");
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
			this.viewStateChanged();
		},
		viewStateChanged : function() {
			var view = state.get("viewState");

			// update disabled state of menu items related to songs
			if ("song" == view) {
				var isInSongbook = false;
				$("#menu-song-add-remove a", this.$el).html(isInSongbook ? "<i class='icon-minus'></i> Remove from songbook" : "<i class='icon-plus'></i> Add to songbook");
			}
			else {
				
			}
		}
	});
	return MenuView;
});
