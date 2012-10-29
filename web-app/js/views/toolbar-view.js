// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'text!templates/toolbar-template.html', 'views/search-view', 'views/slider-view', 'views/songbook-select-view', 'views/menu-view'],
	function($, _, Backbone, state, toolbarTemplate, SearchView, SliderView, SongbookSelectView, MenuView) {
		var SongToolbarView = Backbone.View.extend({
			el : "#toolbar-container",
			initialize : function() {
				_.bindAll(this, "render", "viewStateChanged", "toggleEdit"); // remember: every function that uses 'this' as the current object should be in here
		        this.render();
		        state.bind("change:viewState", this.viewStateChanged);
		    },
		    events : {
		        "click #button-edit": "toggleEdit",
		    },
			render : function() {
				this.$el.html(_.template(toolbarTemplate));
				
				// make buttons
				$(".button", this.$el).each(function() {
					$(this).button({
						text: false,
						icons: {
							primary: $(this).data("icon")
						}
					});
				});
				
			 	// render sliders
			 	$(".slider", this.$el).each(function() {
				    new SliderView({ el:this });
			 	});
			    
			    // render search view
			    new SearchView({ el:$(".query-container", this.$el) });
			    
			    // render songbook selector
			    new SongbookSelectView({ el:$("#select-songbook-container", this.$el) });

			    // render menu button
			    new MenuView({ el:$("#menu-container", this.$el) });
			},
			toggleEdit : function() {
		    	var $button = $("#button-edit", this.$el);
		    	if ("Edit" == $button.button("option", "label")) {
			    	$button.button("option", {label:"Save", icons:{ primary:"ui-icon-disk" }});
			    	state.channel.trigger("button:edit");
		    	}
		    	else {
		        	$button.button("option", {label:"Edit", icons:{ primary:"ui-icon-pencil" }});
			    	state.channel.trigger("button:save");
		    	}
			},
			viewStateChanged : function() {
				var view = state.get("viewState");
	        	// unconditionally reset edit button from "save" to "edit" on any view change
	        	$("#button-edit", this.$el).button("option", {label:"Edit", icons:{ primary:"ui-icon-pencil" }});
	        	// iterate over "data-view" attribute of toolbar children and show/hide them correspondingly
	        	this.$el.find("*[data-views]").each(function() {
	        		var $this = $(this);
	        		var views = $this.data("views");
	        		if ($.isArray(views)) {
	        			($.inArray(view, views) > -1) ? $this.css("visibility", "visible") : $this.css("visibility", "hidden");
	        		}
	        		else {
	        			(views == view) ? $this.css("visibility", "visible") : $this.css("visibility", "hidden");
	        		}
	        	});
			}
		});
		return new SongToolbarView;
	}
);