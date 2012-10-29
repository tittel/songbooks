// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'views/message-view', 'views/error-view', 'models/song-model', 'text!templates/song-edit-template.html', 'chopro'],
	function($, _, Backbone, state, Message, ErrorMessage, SongModel, songEditTemplate) {
		var SongView = Backbone.View.extend({
			el : "#content",
			model : new SongModel,
			initialize : function() {
				_.bindAll(this, "render", "edit", "save"); // remember: every function that uses 'this' as the current object should be in here
				state.channel.on("button:save", this.save);
				state.channel.on("button:edit", this.edit);
		        state.bind("change:columns", this.setColumns);
		        state.bind("change:fontsize", this.setFontSize);

//				this.model.bind('change', this.render);
		    },
			render : function(edit) {
				state.set("viewState", "song");

				// scroll to top
				window.scrollTo(0, 0);

				if (edit) {
					var compiledTemplate = _.template(songEditTemplate, { song : this.model, _ : _ });
					this.$el.html(compiledTemplate);
					this.$el.find("textarea").focus();
				}
				else {
					this.$el.html(choproToHtml($, this.model.get("text")));
				    // give chordlines that "contain" chords a fixed height
				    $(".textline:has(.chord)", this.$el).prev(".chordline").height("1em");
					this.setColumns();
					this.setFontSize();
				}
			},
			edit : function() {
				if ("song" == state.get("viewState")) {
					this.render(true);
				}
			},
			save : function() {
				if ("song" == state.get("viewState")) {
					console.log("saving song ...");
					var $textarea = this.$el.find("textarea");
					if ($textarea.length > 0) {
			        	this.model.set("text", this.$el.find("textarea").val());
			        	this.model.save(null, {
			        		success: function() {
			        			new Message({message:"Song saved."});
			        		},
							error: function(model, response) {
								new ErrorMessage({ message : "Error saving song: " + response.status + " (" + response.statusText + ")" });
							}
			        	});
					}
		        	this.render();
				}
			},
			setColumns : function() {
				var cols = "" + state.get("columns");
				$(".songview").css({ "-moz-column-count" : cols, "-webkit-column-count" : cols, "column-count" : cols });
			},
			setFontSize : function() {
				$(".songview").css({ "font-size" : state.get("fontsize") + "em" });
			}
		});
		return new SongView;
	}
);