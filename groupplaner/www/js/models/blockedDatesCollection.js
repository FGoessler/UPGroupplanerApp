app.groupplaner.BlockedDatesCollection = Backbone.Collection.extend({
	url: app.groupplaner.config.baseUrl + '/blockedDates',

	model: app.groupplaner.BlockedDateModel,

	sync: function (method, collection, options) {
		options = options ? options : {};
		options.headers = app.groupplaner.AuthStore.getAuthHeader();
		return Backbone.Collection.prototype.sync(method, collection, options);
	}
});