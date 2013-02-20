define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'views/message-view', 'views/error-view', 'text!templates/menu-template.html', 'views/song-view', 'collections/songbook-songs-collection' ], function($, _, Backbone, state, Message, ErrorMessage, menuTemplate, songView, songbookSongsCollection) {
	var MenuView = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, "render", "viewStateChanged", "songbookChanged", "songbookSongsCollectionChanged");
	        state.bind("change:viewState", this.viewStateChanged);
	        state.bind("change:songbookId", this.songbookChanged);
	        state.channel.on("songbookSongsCollectionChanged", this.songbookSongsCollectionChanged);
	        this.render();
	    },
		render : function() {
			this.$el.html(_.template(menuTemplate));
			var that = this;
			// TODO: this is a temporary fix for the twitter dropdown menu not working on iPad. remove after fix (version > 2.1.1)
			//$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });
			
			$("li a:not([href])", this.$el).click(function (evt) {
				evt.preventDefault();
				var id = $(this).attr("id");
				if (id && !$(this).parent().hasClass("disabled")) {
					// close menu
					that.$el.removeClass("open");
					var songbookId = state.get("songbookId");
					if ("menu-songbook-manage" == id) {
						Backbone.history.navigate("songbook/" + songbookId, true);
					}
					else if ("menu-song-add-remove" == id) {
						if ("delete" == $(this).attr("rel")) {
							$.ajax({
								url : songbookSongsCollection.url() + "/" + songView.model.get("id"),
								type : "DELETE",
								success : function(data, textStatus, jqXHR) {
				        			new Message({message:"Song removed from songbook."});
									// really trigger event by unsetting songbookId first
									state.unset("songbookId", {silent:true});
									state.set("songbookId", songbookId);
								},
								error : function(jqXHR, textStatus, errorThrown) {
									new ErrorMessage({ message : "<strong>Error removing song from songbook</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
								}
							});
						}
						else {
							$.ajax({
								url : songbookSongsCollection.url(),
								type : "POST",
								data : { songId : songView.model.get("id") },
								success : function(data, textStatus, jqXHR) {
				        			new Message({message:"Song added to songbook."});
									// really trigger event by unsetting songbookId first
									state.unset("songbookId", {silent:true});
									state.set("songbookId", songbookId);
								},
								error : function(jqXHR, textStatus, errorThrown) {
									new ErrorMessage({ message : "<strong>Error adding song to songbook</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
								}
							});
						}
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
			// update state of menu items related to songs
			var showAddRemoveItem = ("song" == view) && (state.get("songbookId").length > 0);
			if (showAddRemoveItem) {
				var containedInSongbook = songbookSongsCollection.where({id: songView.model.get("id")}).length > 0;
				$("#menu-song-add-remove", this.$el).html(containedInSongbook ? "<i class='icon-minus'></i> Remove from songbook" : "<i class='icon-plus'></i> Add to songbook")
				.attr("rel", containedInSongbook ? "delete" : "add");
			}
			$("#menu-song-add-remove-container", this.$el).css("display", showAddRemoveItem ? "list-item" : "none");
			$("#menu-song-add-remove-container + li.divider", this.$el).css("display", showAddRemoveItem ? "list-item" : "none");
		},
		songbookChanged : function() {
			var songbookId = state.get("songbookId");
			// update state of menu items related to songbooks
			$("#menu-songbook-manage", this.$el).css("display", songbookId ? "list-item" : "none");
			// call viewStateChanged because some items depend on the selected songbook
			this.viewStateChanged();
		},
		songbookSongsCollectionChanged : function() {
			this.viewStateChanged();
		}
	});
	return MenuView;
});
