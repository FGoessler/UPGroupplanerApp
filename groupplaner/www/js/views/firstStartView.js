app.groupplaner.FirstStartView = Backbone.View.extend({

	events: {
		"click #go-btn": "go"
	},

	render: function () {
		$(this.el).html(app.groupplaner.templateCache.renderTemplate("firstStartView"));
		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	},

	go: function () {
		app.groupplaner.launcher.router.navigate("login", {trigger: true});
	}

});