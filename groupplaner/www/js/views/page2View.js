var Page2View = Backbone.View.extend({

	render:function (eventName) {
		$(this.el).html(templateCache.renderTemplate("page2"));
		return this;
	}
});