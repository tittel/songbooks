// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'text!templates/panel-template.html', 'views/songbook-select-view', 'views/songbook-songs-view'],
	function($, _, Backbone, state, panelTemplate, SongbookSelectView, SongbookSongsView) {
		var PanelView = Backbone.View.extend({
			el : "#songbook-panel",
			initialize : function() {
				_.bindAll(this, "render", "viewStateChanged"); // remember: every function that uses 'this' as the current object should be in here
		        this.render();
		        state.bind("change:viewState", this.viewStateChanged);
		    },
		    events : {
		    },
			render : function() {
				this.$el.html(_.template(panelTemplate));
			    
				// create collapsible panels with nice scrolling effect
				this.$el.collapsiblePanel({position:"right"}).on("opened closed", function() {
					$(this).getNiceScroll().resize();
				}).niceScroll();

				// render songbook selector
			    new SongbookSelectView({ el:$("#select-songbook-container", this.$el) });
			    // render songs of the songbook
			    new SongbookSongsView({ el:$("#songbook-songs-container", this.$el) });
			},
			viewStateChanged : function() {
			}
		});
		return new PanelView;
	}
);