app.groupplaner.GroupCollection = Backbone.Collection.extend({
	url: app.groupplaner.config.baseUrl + '/group',
	
	model: app.groupplaner.GroupModel,
	
	sync: function(method, collection, options) {
		options = options ? options : {};
		options.headers = app.groupplaner.AuthStore.getAuthHeader();
		Backbone.Collection.prototype.sync(method, collection, options);
	}
});