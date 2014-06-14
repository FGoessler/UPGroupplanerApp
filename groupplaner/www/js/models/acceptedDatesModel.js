app.groupplaner.AcceptedDatesModel = Backbone.Model.extend({
	sync: function (method, model, options) {
		options = options ? options : {};
		options.headers = app.groupplaner.AuthStore.getAuthHeader();
		return Backbone.Model.prototype.sync(method, model, options);
	}
});