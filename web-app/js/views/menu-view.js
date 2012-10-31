define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate', 'text!templates/menu-template.html', 'models/song-model', 'views/song-view' ], function($, _, Backbone, state, menuTemplate, SongModel, songView) {
	var MenuView = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, "render", "setValue");
	        this.render();
	    },
		render : function() {
			this.$el.html(_.template(menuTemplate));
			var that = this;
			$("li", this.$el).each(function() {
				$(this).click(function (evt) {
					evt.preventDefault();
					var id = $(this).attr("id");
					if (id && !$(this).hasClass("disabled")) {
						// close menu
						that.$el.removeClass("open");
						
						if ("menu-song-create" == id) {
							songView.model = new SongModel()
							songView.render(true);
						}
	
						console.log("click ->" + $(this).attr("id"));
					}
					return false;
				});
			});
		},
		setValue : function(event, ui) {
		}
	});
	return MenuView;
});
