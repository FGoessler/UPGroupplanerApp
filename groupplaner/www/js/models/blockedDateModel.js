app.groupplaner.BlockedDateModel = Backbone.Model.extend({
	urlRoot: app.groupplaner.config.baseUrl + '/blockedDates',

	sync: function (method, model, options) {
		options = options ? options : {};
		options.headers = app.groupplaner.AuthStore.getAuthHeader();
		return Backbone.Model.prototype.sync(method, model, options);
	}
});