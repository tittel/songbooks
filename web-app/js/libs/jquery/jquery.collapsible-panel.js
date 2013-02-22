(function($) {
	var methods = {
		init : function(options) { 
			var settings = $.extend({
				"position" : "left"
		    }, options);
			if (settings.position != "left") {
				settings.position = "right";
			}
			
			return this.each(function() {
				var $content = $(this);
				$content.addClass("collapsible-panel-content");
				$content.wrap("<div class='collapsible-panel-wrapper position-" + settings.position + "'></div>");
				$wrapper = $content.parent();
				var $controls = $("<div class='collapsible-panel-controls' />").insertAfter($content);
				var $toggleButton = $("<div class='collapsible-panel-control-toggler collapsible-panel-control'></div>").appendTo($controls);
				$toggleButton.click(function() {
					if ($wrapper.hasClass("open")) {
						methods["_close"].call(this, $wrapper, $content, $toggleButton);
					}
					else {
						methods["_open"].call(this, $wrapper, $content, $toggleButton);
					}
				});
				$wrapper.focusout(function(evt) {
					setTimeout(function() {
						if ($wrapper.has(":focus").length == 0) {
							methods["_close"].call(this, $wrapper, $content, $toggleButton);
					    }
					}, 100);
				});
			})
		},
		_open : function($wrapper, $content, $toggleButton) {
			$wrapper.addClass("open");
			$("i", $toggleButton).removeClass("icon-arrow-right").addClass("icon-arrow-left");
			$content.focus();
			$content.trigger("opened")
		},
		_close : function($wrapper, $content, $toggleButton) {
			$wrapper.removeClass("open");
			$("i", $toggleButton).removeClass("icon-arrow-left").addClass("icon-arrow-right");
			$content.trigger("closed");
		}
	};

	$.fn.collapsiblePanel = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.collapsiblePanel');
		}
	};
})(jQuery);