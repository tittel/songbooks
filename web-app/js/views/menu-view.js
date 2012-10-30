define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'text!templates/menu-template.html' ], function($, _, Backbone, state, menuTemplate) {
	var MenuView = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, "render", "setValue");
	        this.render();
	    },
		render : function() {
			this.$el.html(_.template(menuTemplate));
		},
		setValue : function(event, ui) {
		}
	});
	return MenuView;
});
