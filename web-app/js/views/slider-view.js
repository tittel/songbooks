define([ 'jQuery', 'Underscore', 'Backbone', 'models/appstate' ], function($, _, Backbone, state) {
	var SliderView = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, "render", "setValue");
			this.modelField = this.$el.data("model") || "slider";
			this.name = this.$el.data("name") || "Slider";
	        this.render();
	    },
		render : function() {
		    $("<div class='value'>").appendTo(this.$el);

		    $("<div>").appendTo(this.$el).slider({
				value : this.$el.data("value") || 1,
				min : this.$el.data("min") || 0,
				max : this.$el.data("max") || 2,
				step : this.$el.data("step") || 1,
				change : this.setValue,
				slide : this.setValue
			}).slider("value", state.get(this.modelField) || this.$el.data("value") || 1);

		    // make slider work with touch devices
		    $(".ui-slider-handle", this.$el).bind("touchmove", function(e) {
				e.preventDefault();
				var $slider = $(this).parent();
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

			    var left = $slider.offset().left;
			    var right = left + $slider.width();
			    var min = $slider.slider('option', 'min');
			    var max = $slider.slider('option', 'max');
			    var newvalue = min + (touch.clientX - left) / (right - left) * (max - min);
			    $slider.slider('value', newvalue);
			}).bind("touchstart", function() {
				$(this).addClass("ui-state-hover");
			}).bind("touchend", function() {
				$(this).removeClass("ui-state-hover");
			});
		},
		setValue : function(event, ui) {
			localStorage[this.modelField] = "" + ui.value;
			state.set(this.modelField, ui.value);
			this.$el.find(".value").text(this.name + ": " + ui.value);
		},
		modelField : "",
		name : ""
	});
	return SliderView;
});
