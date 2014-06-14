app.groupplaner.MemberCollection = Backbone.Collection.extend({
	url: function () {
		return app.groupplaner.config.baseUrl + '/group/' + this.groupId + '/member'
	},

	model: app.groupplaner.MemberModel,

	sync: function (method, collection, options) {
		options = options ? options : {};
		options.headers = app.groupplaner.AuthStore.getAuthHeader();
		return Backbone.Collection.prototype.sync(method, collection, options);
	}
});