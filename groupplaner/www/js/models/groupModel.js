app.groupplaner.GroupModel = Backbone.Model.extend({
	urlRoot: app.groupplaner.config.baseUrl + '/group',

	sync: function(method, model, options) {
		options = options ? options : {};
		options.headers = app.groupplaner.AuthStore.getAuthHeader();
		return Backbone.Model.prototype.sync(method, model, options);
	}
});