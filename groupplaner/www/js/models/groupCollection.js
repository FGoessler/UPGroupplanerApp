var GroupCollection = Backbone.Collection.extend({
	url: 'http://localhost:8080/user/group',
	model: GroupModel
});