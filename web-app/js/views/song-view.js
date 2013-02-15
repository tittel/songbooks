define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'models/song-model', 'chopro'],
	function($, _, Backbone, state, SongModel) {
		var SongView = Backbone.View.extend({
			el : "#content",
			model : new SongModel,
			initialize : function() {
				_.bindAll(this, "render", "setColumns", "setZoom");
		        state.bind("change:columns", this.setColumns);
		        state.bind("change:zoom", this.setZoom);
		    },
			render : function() {
				// really trigger event by unsetting viewState first
				state.unset("viewState", {silent:true});
				state.set("viewState", "song");

				// scroll to top
				window.scrollTo(0, 0);

				this.$el.html(choproToHtml($, this.model.get("text")));
				this.setColumns();
				this.setZoom();
			},
			setColumns : function() {
				var cols = "" + state.get("columns");
				$(".songview", this.$el).css({ "-moz-column-count" : cols, "-webkit-column-count" : cols, "column-count" : cols });
			},
			setZoom : function() {
				$(".songview", this.$el).css({ "font-size" : state.get("zoom") + "em" });
			}
		});
		return new SongView;
	}
);