/**
	stepper
	@version:		1.0.0
	@author:		Julien Loutre <julien.loutre@gmail.com>
*/
(function($){
 	$.fn.extend({
 		popup: function() {
			var plugin_namespace = "popup";
			
			var pluginClass = function() {};
			
			
			
			pluginClass.prototype.init = function (options) {
				try {
					
					var scope = this;
					
					this.options = $.extend({
						onResize: 		function(w, h) {},
						onClose: 		function() {},
						closeTrigger: 	$(),
						width:			0.6,
						height:			250
					},options);	
					
					this.options.height += 20;
					// create the overlay
					if ($(".popup-overlay").length == 0) {
						this.overlay = $.create("div", $("body"));
						this.overlay.addClass("popup-overlay");
					} else {
						this.overlay = $(".popup-overlay");
					}
					this.overlay.show();
					
					
					// create the popup
					this.popup = $.create("div", $("body"));
					this.popup.addClass("popup");
					
					this.container	= $.create("div", this.popup);
					this.container.addClass("popup-container");
					this.closelink	= $.create("span", this.container);
					this.closelink.addClass("popup-close");
					this.closelink.html("[close]");
					this.closelink.click(function() {
						scope.closePopup();
					});
					this.content	= $.create("div", this.container);
					this.content.addClass("popup-content");
					//this.popup.insertAfter(this.overlay);
					
					// move the content
					this.content.append(this.element);
					
					this.recenter();
					
					$(window).resize(function() {
						scope.recenter();
					});
					$(document).keydown(function(e) {
						if (e.keyCode == 27) {
							scope.closePopup();
						}
					});
					$("body").scroll(function() {
						scope.recenter();
					});
					this.options.closeTrigger.click(function() {
						scope.closePopup();
					});
					this.overlay.one("click",function() {
						scope.closePopup();
					});
					if (this.options.onInit) {
						this.options.onInit(this);
					}
					
				} catch (err) {
					this.error(err);
				}
			};
			
			
			pluginClass.prototype.recenter = function () {
				try {
					
					var scope = this;
					
					if (this.options.width <= 1) {
						var scale = 0.6;
						
						// center popup
						var diffX = $(document).width()-($(document).width()*scale);
						var diffY = $(document).height()-($(document).height()*scale);
						
						this.popup.css({
							width:		$(document).width()*scale,
							height:		$(document).height()*scale,
							left:		diffX/2,
							top:		diffY/2+$(document).scrollTop()
						});
						
						this.options.onResize.apply(this, [$(document).width()*scale, $(document).height()*scale]);
					} else {
						
						
						// center popup
						var diffX = $(document).width()-this.options.width;
						var diffY = $(document).height()-this.options.height;
						
						this.popup.css({
							width:		this.options.width,
							height:		this.options.height,
							left:		diffX/2,
							top:		diffY/2+$(document).scrollTop()
						});
						
						
						this.options.onResize.apply(this, [this.options.width, this.options.height]);
					}
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.closePopup = function () {
				try {
					
					var scope = this;
					
					this.popup.remove();
					this.overlay.hide();
					
					this.options.onClose.apply(this);
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.getInstance = function (op) {
				try {
					op.callback(this);
					
					return this;
					
				} catch (err) {
					this.error(err);
				}
			};
			
			
			
			
			
			pluginClass.prototype.__init = function (element) {
				try {
					this.element = element;
				} catch (err) {
					this.error(err);
				}
			};
			// centralized error handler
			pluginClass.prototype.error = function (e) {
				if (console && console.info) {
					console.info("error on "+plugin_namespace+":",e);
				}
			};
			// Centralized routing function
			pluginClass.prototype.execute = function (fn, options) {
				try {
					if (typeof(this[fn]) == "function") {
						var output = this[fn].apply(this, [options]);
					} else {
						this.error("'"+fn.toString()+"()' is not a function");
					}
				} catch (err) {
					this.error(err);
				}
			};
			
			// process
			var fn;
			var options;
			if (arguments.length == 0) {
				fn = "init";
				options = {};
			} else if (arguments.length == 1 && typeof(arguments[0]) == 'object') {
				fn = "init";
				options = $.extend({},arguments[0]);
			} else {
				fn = arguments[0];
				options = arguments[1];
			}
			$.each(this, function(idx, item) {
				// if the plugin does not yet exist, let's create it.
				if ($(item).data(plugin_namespace) == null) {
					$(item).data(plugin_namespace, new pluginClass());
					$(item).data(plugin_namespace).__init($(item));
				}
				$(item).data(plugin_namespace).execute(fn, options);
			});
			return this;
    	}
	});
	
})(jQuery);

