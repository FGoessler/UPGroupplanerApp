var Page1View = Backbone.View.extend({

	render:function (eventName) {
		$(this.el).html(templateCache.renderTemplate("page1"));
		return this;
	}
});
