define(['jQuery', 'Underscore', 'Backbone' ], function ($, _, Backbone){
	return Backbone.View.extend({
		id: 'message',
		displayLength: 5000,
		defaultMessage: '',
		icon : "ui-icon-info",
		messageClass : "ui-state-highlight",

		initialize: function() {
			_.bindAll(this, 'render');
			this.message = this.options.message || this.defaultMessage;
			this.render();
		},

		render: function() {
			console.log("rendering message: " + this.message);
			var _self = this;
			var msg = $('<div>')
				.addClass(this.messageClass + " ui-corner-all message")
				.append("<span class='ui-icon " + this.icon + "' style='float:left; margin-right:.3em;'></span>" + this.message)
				.css('z-index', 100000)
				.hide();
			var container = $('#' + this.id);
			if(container.length > 0){
				container.append(msg);
			} else {
				$('body').append(this.el);
				$(this.el).append(msg);
			}			
			$(msg).slideDown();

			if(this.displayLength){
				var timerId = window.setInterval(function() {
					clearInterval(timerId);
					$(msg).slideUp(200, function() {
						msg.remove();
					});
				}, _self.displayLength);
			}
			return this;
		}
	});
});