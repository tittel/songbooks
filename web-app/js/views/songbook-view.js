// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'views/message-view', 'views/error-view', 'models/songbook-model', 'text!templates/songbook-template.html'],
	function($, _, Backbone, state, Message, ErrorMessage, SongbookModel, songbookTemplate) {
		var SongbookView = Backbone.View.extend({
			el : "#content",
			model : new SongbookModel,
			initialize : function() {
				_.bindAll(this, "render", "save", "songbookChanged", "updateControlsFromExportState", "exportSongbook", "downloadSongbook");
				state.channel.on("button:save", this.save);
		        state.bind("change:songbookId", this.songbookChanged);
		    },
		    events : {
		        "click #button-export": "exportSongbook",
		        "click #button-download": "downloadSongbook"
		    },
			render : function() {
				state.set("viewState", "songbook");

				// scroll to top
				window.scrollTo(0, 0);

				var compiledTemplate = _.template(songbookTemplate, { songbook : this.model, _ : _});
				this.$el.html(compiledTemplate);
				this.updateControlsFromExportState(this.model.get("exportState"));
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
					this.model.set("id", songbookId).fetch({
						error : function(model, response) {
							new ErrorMessage({ message : "<strong>Error loading songbook</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
						}
					});
				}
				else {
					this.model = new SongbookModel();
				}
			},
			updateControlsFromExportState : function(previousState) {
				var that = this;
				this.model.fetch({
					success: function(model) {
						var exportState = model.get("exportState");
						var downloadable = exportState == 2;
						if (downloadable) {
							if (previousState == 1) {
								new Message({message:"<strong>Export finished</strong><br>You can download it now ..."});
							}
							$("#button-download", that.$el).removeClass("disabled");
						}
						else {
							$("#button-download", that.$el).addClass("disabled");
						}
						var exportable = exportState != 1;
						if (exportable) {
							$("#button-export", that.$el).removeClass("disabled loading");
						}
						else {
							// reload state every second
							_.debounce(function() { that.updateControlsFromExportState(exportState); }, 1000)();
							$("#button-export", that.$el).addClass("disabled loading");
						}
					},
					error: function(model, response) {
						new ErrorMessage({ message : "<strong>Error loading songbook</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
					},
					global : false // prevents ajaxStart event (spinner)
				});
			},
			exportSongbook : function() {
				var that = this;
				if (!$("#button-export", this.$el).hasClass("disabled")) {
					$.ajax({
						url : contextPath + "songbook/" + this.model.get("id") + "/export",
						success : function() {
							new Message({message:"<strong>Export started</strong><br>Please wait ..."});
							that.updateControlsFromExportState(that.model.get("exportState"));
						},
						error : function(jqXHR, textStatus, errorThrown) { new ErrorMessage({ message : "<strong>Error exporting songbook</strong><br><i>" + jqXHR.status + " (" + jqXHR.statusText + ")</i><br>" + jqXHR.responseText }); },
						global : false // prevents ajaxStart event (spinner)
					});
				}
			},
			downloadSongbook : function() {
				if (!$("#button-download", this.$el).hasClass("disabled")) {
					// don't use backbone router, let the browser request the PDF
					window.location.href = contextPath + "songbook/" + this.model.get("id") + "/download";
				}
			}
		});
		return new SongbookView;
	}
);