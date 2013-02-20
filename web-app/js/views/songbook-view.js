// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'views/message-view', 'views/error-view', 'models/songbook-model', 'text!templates/songbook-template.html'],
	function($, _, Backbone, state, Message, ErrorMessage, SongbookModel, songbookTemplate) {
		var SongbookView = Backbone.View.extend({
			el : "#content",
			model : new SongbookModel,
			probing : {},
			initialize : function() {
				_.bindAll(this, "render", "save", "songbookChanged", "pollForDownload", "exportSongbook");
				state.channel.on("button:save", this.save);
		        state.bind("change:songbookId", this.songbookChanged);
		    },
		    events : {
		        "click #button-export": "exportSongbook",
		    },
			render : function() {
				state.set("viewState", "songbook");

				// scroll to top
				window.scrollTo(0, 0);

				var compiledTemplate = _.template(songbookTemplate, { songbook : this.model, _ : _});
				this.$el.html(compiledTemplate);
				// register delete button click
				var that = this;
				$("#songbookDeleteButton", this.$el).click(function (evt) {
					that.model.destroy({
		        		success: function() {
		        			new Message({message:"Songbook deleted."});
		        			window.history.back();
		        			state.set("songbookId", null);
		        		},
						error: function(model, response) {
							new ErrorMessage({ message : "<strong>Error deleting songbook</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
						}
		        	});
				});
			},
			save : function() {
				if ("songbook" == state.get("viewState")) {
		        	var model = this.model;
		        	var isNew = model.isNew();
		        	model.set("name", $("#name", this.$el).val());
		        	model.set("author", $("#author", this.$el).val());
		        	model.set("format", $("#format", this.$el).val());
		        	model.save(null, {
		        		success: function() {
		        			new Message({message:"Songbook " + (isNew ? "created" : "saved") + "."});
		        			if (isNew) {
		        				state.set("songbookId", model.get("id").toString());
		        			}
		        			window.history.back();
		        		},
						error: function(model, response) {
							new ErrorMessage({ message : "<strong>Error saving songbook</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
						}
		        	});
				}
			},
			songbookChanged : function() {
				var songbookId = state.get("songbookId");
				if (songbookId) {
					var that = this;
					this.model.set("id", songbookId).fetch({
						success : function() {
							if (state.get("viewState") == "songbook") {
								that.render();
							}
						},
						error : function(model, response) {
							new ErrorMessage({ message : "<strong>Error loading songbook</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
						}
					});
				}
				else {
					this.model = new SongbookModel();
					if (state.get("viewState") == "songbook") {
						this.render();
					}
				}
			},
			pollForDownload : function(id, looping) {
				if (id) {
					var that = this;
					$.ajax({
						url : contextPath + "songbook/" + id + "/export",
						success : function(data, textStatus, jqXHR) {
							if (201 == jqXHR.status) {
								that.probing[id] = false;
								// only update button state if we're probing the same model
								if (id == that.model.get("id")) {
									$("#button-export", that.$el).removeClass("disabled loading");
								}
								new Message({message:"<strong>Songbook exported</strong><br>Downloading it now ..."});
								window.location.href = jqXHR.getResponseHeader('Location');
							}
							else if (looping || !that.probing[id]) {
								that.probing[id] = true;
								// reload state every second
								_.debounce(function() { that.pollForDownload(id, true); }, 1000)();
							}
						},
						error : function(jqXHR, textStatus, errorThrown) {
							// only update button state if we're probing the same model
							if (id == that.model.get("id")) {
								$("#button-export", that.$el).removeClass("disabled loading");
							}
							new ErrorMessage({ message : "<strong>Error probing songbook</strong><br><i>" + jqXHR.status + " (" + jqXHR.statusText + ")</i><br>" + jqXHR.responseText });
						},
						global : false // prevents ajaxStart event (spinner)
					});
				}
			},
			exportSongbook : function() {
				if (!$("#button-export", this.$el).hasClass("disabled")) {
					$("#button-export", this.$el).addClass("disabled loading");
					new Message({message:"<strong>Export started</strong><br>Please wait ..."});
					this.pollForDownload(this.model.get("id"));
				}
			}
		});
		return new SongbookView;
	}
);
