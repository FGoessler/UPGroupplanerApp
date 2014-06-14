app.groupplaner.AcceptedDatesCollection = Backbone.Collection.extend({
	url: function () {
		return app.groupplaner.config.baseUrl + '/group/' + this.groupId + '/acceptedDates'
	},

	model: app.groupplaner.AcceptedDatesModel,

	sync: function (method, collection, options) {
		options = options ? options : {};
		options.headers = app.groupplaner.AuthStore.getAuthHeader();
		return Backbone.Collection.prototype.sync(method, collection, options);
	}
});