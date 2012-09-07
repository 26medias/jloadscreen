/**
	mobileViewport
	@version:		1.2.0
	@author:		Julien Loutre <julien.loutre@gmail.com>
*/
(function($){
 	$.fn.extend({
 		loadscreen: function() {
			var plugin_namespace = "loadscreen";
			
			
			var pluginClass = function() {};
			
			
			
			pluginClass.prototype.init = function (options) {
				try {
					
					var scope = this;
					
					this.options = $.extend({
						
					},options);					
					
					this.popup 	= false;
					this.n		= 0;
					this.t		= 0;
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.start = function () {
				try {
					
					var scope = this;
					
					if (this.n == 0) {
						// first item
						// create the popup
						this.div = $.create("div");
						this.div.addClass("jprogress-container");
						this.div.popup({
							width:	200,
							height:	50,
							onInit: function(instance) {
								scope.popup = instance;
							}
						});
						this.loadingBar 	= $.create("div", this.div);
						this.loadingBar.addClass("jprogress");
						this.loadingInner 	= $.create("div", this.loadingBar);
						this.loadingInner.addClass("jprogress-inner");
						this.loadingMessage	= $.create("div", this.div);
						this.loadingMessage.addClass("jprogress-message");
						this.n 				= 1;
						this.t				= 1;
						this.update();
						
						// debug
						/*
						this.debugCreate 		= $.create("button",this.div);
						this.debugCreate.addClass(".create").html("+").click(function() {
							$("body").loadscreen("start");
						});
						this.debugRemove 	= $.create("button",this.div);
						this.debugRemove.addClass(".remove").html("-").click(function() {
							$("body").loadscreen("stop");
						});
						*/
					} else {
						// add to popup
						this.n++;
						this.t++;
						this.update();
					}
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.stop = function () {
				try {
					
					var scope = this;
					if (this.n == 0) {
						// can't remove, nothing loading...
					} else if (this.n == 1) {
						// last screen to remove...
						this.n = 0;
						this.t = 0;	// reset total counter
						this.popup.closePopup();
					} else {
						this.n--;
						this.update();
					}
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.update = function () {
				try {
					
					if (this.t==1) {
						this.loadingInner.css("width","100%");
						this.loadingMessage.html("Loading... Please wait...");
					} else {
						var pct = (this.t-this.n+1)/this.t*100;
						this.loadingInner.css("width",pct+"%");
						this.loadingMessage.html("Loading "+(this.t-this.n+1)+"/"+this.t+"... Please wait...");
					}
					
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

