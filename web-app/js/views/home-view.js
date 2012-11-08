define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'text!templates/home-template.html', 'views/search-view' ], function($, _, Backbone, state, homeTemplate, SearchView) {
	var HomeView = Backbone.View.extend({
		el : "#content",
		render : function() {
			var initialPageLoad = state.get("viewState") == null;
			state.set("viewState", "home");
			$template = $(homeTemplate);
			if (initialPageLoad) {
				$template.hide();
			}
			this.$el.html($template);

			// render search view
		    new SearchView({ el:$(".query-container", this.$el) });
		    if (initialPageLoad) {
		    	$template.fadeIn("slow");
		    }
		}
	});
	return new HomeView;
});
