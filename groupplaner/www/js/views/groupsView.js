app.groupplaner.GroupsView = Backbone.View.extend({
	groups: new app.groupplaner.GroupCollection(),

	events: {
		"click #add-group-btn" : "addGroup"
	},
	
	initialize: function() {
		this.listenTo(this.groups, 'change', this.render);
		this.listenTo(this.groups, 'add', this.render);
		this.listenTo(this.groups, 'remove', this.render);
		this.listenTo(this.groups, 'sync', this.render);
		this.groups.fetch();
	},
	
	render:function () {
		var template = app.groupplaner.templateCache.renderTemplate("groupsView", {groups: this.groups.toJSON()});
		$(this.el).html(template);
		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	},
	
	addGroup: function() {
		var self = this;
		var promptCallback = function(result) {
			if (result.buttonIndex === 1) {
				self.groups.create({name: result.input1}, {wait: true,
					error: function () {
						navigator.notification.alert("Erstellen der Gruppe fehlgeschlagen.");
					}});
			}
		};
		navigator.notification.prompt("Bitte geben Sie den Namen der neuen Gruppe ein.", promptCallback, "Neue Gruppe", ["OK","Abbrechen"]);
	}

});