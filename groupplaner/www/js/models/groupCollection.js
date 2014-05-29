app.groupplaner.GroupCollection = Backbone.Collection.extend({
	url: app.groupplaner.config.baseUrl + '/group',
	model: app.groupplaner.GroupModel
});