define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'text!templates/search-template.html' ], function($, _, Backbone, state, searchTemplate) {
	var SearchView = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, "render", "textEntered", "delayedSearch", "queryChanged");
	        state.bind("change:query", this.queryChanged);
	        this.render();
	    },
	    events : {
	        "keypress .query" : "textEntered"
	    },
		render : function() {
			this.$el.html(_.template(searchTemplate));
			$(".query").focus();
		},
		textEntered : function(e) {
			console.log("event -> " + e);
			if (e.which == 13) {
				e.preventDefault();
				// really trigger event by unsetting query first
				state.unset("query", {silent:true});
				state.set("query", $(".query", this.$el).val());
			}
			else {
				this.delayedSearch();
			}
		},
		delayedSearch : _.debounce(function() {
			state.set("query", $(".query", this.$el).val());
		}, 600),
		queryChanged : function() {
			$(".query", this.$el).val(state.get("query"));
		}
	});
	return SearchView;
});
