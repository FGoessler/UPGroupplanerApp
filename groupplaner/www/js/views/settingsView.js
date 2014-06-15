app.groupplaner.SettingsView = Backbone.View.extend({
	dates: new app.groupplaner.BlockedDatesCollection(),

	events: {
		"click #logout-btn": "logout",
		"click .ui-icon-edit": "editDate",
		"click .ui-icon-delete": "deleteDate"
	},

	initialize: function () {
		this.listenTo(this.dates, 'change', this.render);
		this.listenTo(this.dates, 'add', this.render);
		this.listenTo(this.dates, 'remove', this.render);
		this.listenTo(this.dates, 'sync', this.render);
		this.dates.fetch();
	},

	render: function () {
		var template = app.groupplaner.templateCache.renderTemplate("settingsView", {dates: this.dates.toJSON()});
		$(this.el).html(template);
		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	},

	deleteDate: function (event) {
		var dateId = $(event.target).attr("data-date-id");
		var model = this.dates.get(dateId);

		var self = this;
		var confirmHandler = function (button) {
			if (button === 1) {
				model.destroy().success(function () {
					self.dates.remove(model)
				}).fail(function () {
					navigator.notification.alert("Zeitraum konnte nicht gelöscht werden.");
				});
			}
		};
		navigator.notification.confirm("Den Zeitraum wirklich löschen?", confirmHandler, "Achtung", ["Ja", "Nein"]);
	},

	editDate: function (event) {
		var dateId = $(event.target).attr("data-date-id");
		app.groupplaner.launcher.router.navigate("blockedDate/" + dateId, {trigger: true});
	},

	logout: function () {
		var confirmHandler = function (button) {
			if (button === 1) {
				app.groupplaner.AuthStore.logout();
			}
		};
		navigator.notification.confirm("Wirklich ausloggen?", confirmHandler, "Achtung", ["Ja", "Nein"]);
	}

});