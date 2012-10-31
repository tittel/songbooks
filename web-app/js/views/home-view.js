define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'text!templates/home-template.html', 'views/search-view' ], function($, _, Backbone, state, homeTemplate, SearchView) {
	var HomeView = Backbone.View.extend({
		el : "#content",
		render : function() {
			state.set("viewState", "home");
			this.$el.html(homeTemplate);

			// render search view
		    new SearchView({ el:$(".query-container", this.$el) });
		}
	});
	return new HomeView;
});
