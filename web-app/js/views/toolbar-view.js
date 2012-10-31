// Filename: views/projects/list
define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'text!templates/toolbar-template.html', 'views/search-view', 'views/slider-view', 'views/songbook-select-view', 'views/menu-view'],
	function($, _, Backbone, state, toolbarTemplate, SearchView, SliderView, SongbookSelectView, MenuView) {
		var SongToolbarView = Backbone.View.extend({
			el : "#toolbar",
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
				$("#button-edit *:first-child", this.$el).addClass("icon-pencil");
				
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
		    	var $icon = $("#button-edit *:first-child", this.$el);
		    	if ($icon.hasClass("icon-pencil")) {
			    	state.channel.trigger("button:edit");
		    	}
		    	else {
			    	state.channel.trigger("button:save");
		    	}
			},
			viewStateChanged : function() {
				var view = state.get("viewState");
				// set toolbar style depending on view
				if ("home" == view) {
					this.$el.removeClass("well well-large");
				}
				else {
					this.$el.addClass("well well-large");
				}
				
				// set edit song button state depending on view
				if ("song-edit" == view) {
					$("#button-edit *:first-child", this.$el).removeClass("icon-pencil").addClass("icon-ok");
				}
				else {
					$("#button-edit *:first-child", this.$el).removeClass("icon-ok").addClass("icon-pencil");
				}

	        	// iterate over "data-view" attribute of toolbar children and show/hide them correspondingly
	        	this.$el.find("*[data-views]").each(function() {
	        		var $this = $(this);
	        		var views = $this.data("views");
	        		var cssProp = "visibility";
	        		var cssValOn = "visible";
	        		var cssValOff = "hidden";
	        		if ("display" == $this.data("display")) {
		        		cssProp = "display";
		        		cssValOn = $this.data("display-on") || "inline-block";
		        		cssValOff = "none";
	        		}
	        		if ($.isArray(views)) {
	        			$this.css(cssProp, ($.inArray(view, views) > -1) ? cssValOn : cssValOff);
	        		}
	        		else {
	        			$this.css(cssProp, (views == view) ? cssValOn : cssValOff);
	        		}
	        	});
			}
		});
		return new SongToolbarView;
	}
);