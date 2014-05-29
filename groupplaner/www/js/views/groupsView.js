app.groupplaner.GroupsView = Backbone.View.extend({
	groups: new app.groupplaner.GroupCollection(),

	initialize: function() {
		this.groups.fetch();
		this.listenTo(this.groups, 'change', this.render);
		this.listenTo(this.groups, 'add', this.render);
		this.listenTo(this.groups, 'remove', this.render);
	},
	
	render:function (eventName) {
		var template = app.groupplaner.templateCache.renderTemplate("groupsView", {groups: this.groups.toJSON()});
		$(this.el).html(template);
		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	}
});