define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'views/message-view', 'views/error-view', 'views/song-view', 'text!templates/song-edit-template.html', 'chopro'],
	function($, _, Backbone, state, Message, ErrorMessage, songView, songEditTemplate) {
		var SongEditView = Backbone.View.extend({
			el : "#content",
			initialize : function() {
				_.bindAll(this, "render", "save", "edit");
				state.channel.on("button:save", this.save);
				state.channel.on("button:edit", this.edit);
		    },
			render : function(edit) {
				state.set("viewState", "song-edit");

				var compiledTemplate = _.template(songEditTemplate, { song : songView.model, _ : _ });
				this.$el.html(compiledTemplate);
				this.$el.find("textarea").focus();
			},
			edit : function() {
				if ("song" == state.get("viewState")) {
					this.render();
				}
			},
			save : function() {
				if ("song-edit" == state.get("viewState")) {
					var $textarea = this.$el.find("textarea");
					if ($textarea.length > 0) {
			        	var model = songView.model;
			        	var isNew = model.isNew();
			        	model.set("text", this.$el.find("textarea").val());
			        	model.save(null, {
			        		success: function() {
			        			new Message({message:"Song saved."});
			        			if (isNew) {
			        				// fake the url of new song, without sending a request
									Backbone.history.navigate("song/" + model.get("id"));
			        			}
		        				songView.render();
			        		},
							error: function(model, response) {
								new ErrorMessage({ message : "<strong>Error saving song</strong>\n<i>" + response.status + " (" + response.statusText + ")</i>\n" + response.responseText });
							}
			        	});
					}
				}
			}
		});
		return new SongEditView;
	}
);