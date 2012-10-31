define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'text!templates/home-template.html', 'views/search-view' ], function($, _, Backbone, state, homeTemplate, SearchView) {
	var HomeView = Backbone.View.extend({
		el : "#content",
		initialize : function() {
	        state.bind("change:viewState", this.viewStateChanged);
	    },
		render : function() {
			state.set("viewState", "home");
			this.$el.html(homeTemplate);

			// render search view
		    new SearchView({ el:$(".query-container", this.$el) });
		},
		viewStateChanged : function() {
			var view = state.get("viewState");
        	if ("home" == view) {
        		$("#toolbar").addClass("home");
        	}
        	else {
        		$("#toolbar").removeClass("home");
        	}
		}
	});
	return new HomeView;
});
