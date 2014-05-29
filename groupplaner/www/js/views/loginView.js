app.groupplaner.LoginView = Backbone.View.extend({

	events: {
		"click #login-btn": "login"
	},

	render: function () {
		$(this.el).html(app.groupplaner.templateCache.renderTemplate("loginView"));
		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	},

	login: function () {
		var email = $("#login-email").val();
		var password = $("#login-password").val();
		this.disableForm();
		var self = this;
		app.groupplaner.AuthStore.login(email, password, function (success) {
			if (success) {
				app.groupplaner.launcher.router.navigate("groups", {trigger: true});
			} else {
				self.enableForm();
				navigator.notification.alert("Die eingegebenen Daten waren leider nicht korrekt.", null, "Fehler");
			}
		});
	},

	disableForm: function () {
		$(":input").prop('disabled', true);
		$.mobile.loading().loader("show");
	},

	enableForm: function () {
		$(":input").prop('disabled', false);
		$.mobile.loading().loader("hide");
	}

});