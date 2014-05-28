var HomeView = Backbone.View.extend({

	render:function (eventName) {
		$(this.el).html(templateCache.renderTemplate("home"));
		return this;
	}
});