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
				var $panel = $(this);
				$panel.addClass("collapsible-panel position-" + settings.position);
				var $controls = $("<div class='collapsible-panel-controls' />").insertAfter($panel);
				var $toggleButton = $("<div class='collapsible-panel-control-toggler collapsible-panel-control'></div>").appendTo($controls);
				$toggleButton.click(function() {
					if ($panel.hasClass("open")) {
						methods["_close"].call(this, $panel, $toggleButton);
					}
					else {
						methods["_open"].call(this, $panel, $toggleButton);
					}
				});
				$panel.focusout(function(evt) {
					setTimeout(function() {
						if ($panel.has(":focus").length == 0 && !$panel.is(":focus")) {
							methods["_close"].call(this, $panel, $toggleButton);
					    }
					}, 100);
				});
			})
		},
		_open : function($panel, $toggleButton) {
			$panel.addClass("open");
			$("i", $toggleButton).removeClass("icon-arrow-right").addClass("icon-arrow-left");
			// focus first focusable element on panel
			$('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]', $panel).filter(":visible").first().focus();
			$panel.trigger("opened")
		},
		_close : function($panel, $toggleButton) {
			$panel.removeClass("open");
			$("i", $toggleButton).removeClass("icon-arrow-left").addClass("icon-arrow-right");
			$panel.trigger("closed");
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