// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'views/message-view', 'views/error-view', 'models/songbook-model', 'text!templates/songbook-template.html'],
	function($, _, Backbone, state, Message, ErrorMessage, SongbookModel, songbookTemplate) {
		var SongbookView = Backbone.View.extend({
			el : "#content",
			model : new SongbookModel,
			initialize : function() {
				_.bindAll(this, "render", "save", "songbookChanged");
				state.channel.on("button:save", this.save);
		        state.bind("change:songbookId", this.songbookChanged);
		    },
			render : function() {
				state.set("viewState", "songbook");

				// scroll to top
				window.scrollTo(0, 0);

				var compiledTemplate = _.template(songbookTemplate, { songbook : this.model, _ : _ });
				this.$el.html(compiledTemplate);
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
							new ErrorMessage({ message : "<strong>Error saving songbook</strong>\n<i>" + response.status + " (" + response.statusText + ")</i>\n" + response.responseText });
						}
		        	});
				}
			},
			songbookChanged : function() {
				var songbookId = state.get("songbookId");
				if (songbookId) {
					console.log("FETCHING SONGBOOK -> '" + songbookId + "'");
					this.model.set("id", songbookId).fetch({
						error : function(model, response) {
							new ErrorMessage({ message : "<strong>Error loading songbook</strong>\n<i>" + response.status + " (" + response.statusText + ")</i>\n" + response.responseText });
						}
					});
				}
				else {
					this.model = new SongbookModel();
				}
			}
		});
		return new SongbookView;
	}
);