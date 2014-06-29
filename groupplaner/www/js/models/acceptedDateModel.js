app.groupplaner.AcceptedDateModel = Backbone.Model.extend({
	urlRoot: function () {
		return app.groupplaner.config.baseUrl + '/group/' + this.groupId + '/acceptedDates'
	},

	sync: function (method, model, options) {
		options = options ? options : {};
		options.headers = app.groupplaner.AuthStore.getAuthHeader();
		return Backbone.Model.prototype.sync(method, model, options);
	}
});