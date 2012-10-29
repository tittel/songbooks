define(['jQuery', 'Underscore', 'Backbone', 'views/message-view' ], function ($, _, Backbone, Message) {
  return Message.extend({
		className : "error",
		icon : "ui-icon-alert",
		messageClass : "ui-state-error",
		defaultMessage : 'Something went wrong. Please try again.'
	});
});