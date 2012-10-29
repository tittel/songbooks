define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate' ], function($, _, Backbone, state) {
	var MenuView = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, "render", "setValue");
	        this.render();
	    },
		render : function() {
			var data = $("<div><ul><li><a href='#'>Test</a></li><li><a href='#'>Test 2</a></li></ul></div>").html();
			this.$el.hover(
	    		function(){ $(this).removeClass('ui-state-default').addClass('ui-state-focus'); },
	    		function(){ $(this).removeClass('ui-state-focus').addClass('ui-state-default'); }
	    	)
	    	.addClass("fg-button ui-widget ui-state-default ui-corner-all")
			.append('<span class="fg-button-icon-solo ui-icon ui-icon-gear"></span>')
			.fgmenu({ content: data, flyOut: true });
		},
		setValue : function(event, ui) {
		}
	});
	return MenuView;
});
