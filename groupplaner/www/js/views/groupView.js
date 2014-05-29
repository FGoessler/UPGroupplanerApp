app.groupplaner.GroupView = Backbone.View.extend({
	group: null,
	
	events:{
		"click #delete-group-btn": "deleteGroup"
	},
	
	initialize:function(options){
		if(options && options.groupId) {
			this.group = new app.groupplaner.GroupModel({id:options.groupId});
			this.listenTo(this.group, "change", this.render);
			this.group.fetch();
		}
	},
	
	render:function (eventName) {
		$(this.el).html(app.groupplaner.templateCache.renderTemplate("groupView", {group:this.group.toJSON()}));
		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	},
	
	deleteGroup: function(){
		var self = this;
		var confirmHandler = function(button) {
			if (button === 1) {
				self.group.destroy().done(function () {
					window.history.back();
				}).fail(function () {
					navigator.notification.alert("Gruppe konnte nicht gelöscht werden.");
				});
			}
		};
		navigator.notification.confirm("Die Gruppe '" + this.group.get("name") + "' wirklich löschen?", confirmHandler, "Achtung", ["Ja","Nein"]);
	}
});
