// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'views/message-view', 'models/songbook-model', 'text!templates/songbook-edit-template.html'],
	function($, _, Backbone, state, Message, SongbookModel, songbookEditTemplate) {
		var SongView = Backbone.View.extend({
			el : "#content",
			model : new SongbookModel,
			initialize : function() {
				_.bindAll(this, "render", "edit", "save");
				state.channel.on("button:save", this.save);
				state.channel.on("button:edit", this.edit);
		    },
			render : function() {
				state.set("viewState", "songbook");

				// scroll to top
				window.scrollTo(0, 0);

				var compiledTemplate = _.template(songbookEditTemplate, { songbook : this.model, _ : _ });
				this.$el.html(compiledTemplate);
			},
			edit : function() {
				if ("songbook" == state.get("viewState")) {
					this.render();
				}
			},
			save : function() {
				if ("songbook" == state.get("viewState")) {
					/*
					var $textarea = this.$el.find("textarea");
					if ($textarea.length > 0) {
			        	this.model.set("text", this.$el.find("textarea").val());
			        	this.model.save(null, {
			        		success: function() {
			        			new Message({message:"Song saved."});
			        		}
			        	});
					}
					*/
		        	this.render();
				}
			}
		});
		return new SongView;
	}
);