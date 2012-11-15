// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'views/message-view', 'views/error-view', 'models/songbook-model', 'text!templates/songbook-template.html'],
	function($, _, Backbone, state, Message, ErrorMessage, SongbookModel, songbookTemplate) {
		var SongbookView = Backbone.View.extend({
			el : "#content",
			model : new SongbookModel,
			probing : {},
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
				this.updateControlsFromExportState(this.model.get("id"), this.model.get("name"), this.model.get("exportState"));
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
			updateControlsFromExportState : function(id, name, previousState, looping) {
				console.log(this.probing)
				if (id) {
					var that = this;
					$.ajax({
						url : contextPath + "api/songbook/" + id,
						success : function(data) {
							if (id == that.model.get("id")) {
								var exportState = data.exportState;
								console.log("STATE=" + exportState);
								var downloadable = exportState == 2;
								if (downloadable) {
									if (previousState == 1) {
										new Message({message:"<strong>\"" + name + "\" exported</strong><br>You can <a class='internal' href='" + (contextPath + "songbook/" + id + "/download") + "'>download</a> it now ..."});
									}
									$("#button-download", that.$el).removeClass("disabled").addClass("btn-success");
								}
								else {
									$("#button-download", that.$el).addClass("disabled").removeClass("btn-success");
								}
								var exportable = exportState != 1;
								if (exportable) {
									$("#button-export", that.$el).removeClass("disabled loading");
									that.probing[id] = false;
								}
								else {
									$("#button-export", that.$el).addClass("disabled loading");
									if (looping || !that.probing[id]) {
										that.probing[id] = true;
										// reload state every second
										_.debounce(function() { that.updateControlsFromExportState(id, name, exportState, true); }, 1000)();
									}
								}
							}
						},
						error : function(jqXHR, textStatus, errorThrown) { new ErrorMessage({ message : "<strong>Error probing songbook</strong><br><i>" + jqXHR.status + " (" + jqXHR.statusText + ")</i><br>" + jqXHR.responseText }); },
						global : false // prevents ajaxStart event (spinner)
					});
				}
			},
			exportSongbook : function() {
				var that = this;
				if (!$("#button-export", this.$el).hasClass("disabled")) {
					var id = this.model.get("id");
					var name = this.model.get("name");
					var exportState = this.model.get("exportState");
					$.ajax({
						url : contextPath + "songbook/" + id + "/export",
						success : function() {
							new Message({message:"<strong>Export started</strong><br>Please wait ..."});
							that.updateControlsFromExportState(id, name, exportState);
						},
						error : function(jqXHR, textStatus, errorThrown) { new ErrorMessage({ message : "<strong>Error exporting \"" + name + "\"</strong><br><i>" + jqXHR.status + " (" + jqXHR.statusText + ")</i><br>" + jqXHR.responseText }); },
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
