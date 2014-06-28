app.groupplaner.GroupsView = Backbone.View.extend({
	groups: new app.groupplaner.GroupCollection(),
	groupMembers: {},
	groupDates: {},

	events: {
		"click #add-group-btn" : "addGroup"
	},
	
	initialize: function() {
		this.listenTo(this.groups, 'change', this.loadGroupsDetails);
		this.listenTo(this.groups, 'add', this.loadGroupsDetails);
		this.listenTo(this.groups, 'remove', this.loadGroupsDetails);
		this.listenTo(this.groups, 'sync', this.loadGroupsDetails);
		this.groups.fetch();
	},
	
	render:function () {
		var template = app.groupplaner.templateCache.renderTemplate("groupsView", {
			groups: this.groups.toJSON(),
			groupsStatus: this.calculateGroupsStatus()
		});
		$(this.el).html(template);
		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	},

	loadGroupsDetails: function() {
		var self = this;
		this.groups.each(function(group){
			var id = group.get("id");

			self.groupMembers[id] = new app.groupplaner.MemberCollection();
			self.groupMembers[id].groupId = id;
			self.groupDates[id] = new app.groupplaner.AcceptedDatesCollection();
			self.groupDates[id].groupId = id;

			self.groupMembers[id].fetch().always(self.render);
			self.groupDates[id].fetch().always(self.render);
		});

		this.render();
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
	},

	calculateGroupsStatus: function(){
		if(!this.groups) return {};

		var groupsStatus = {};
		var self = this;

		this.groups.each(function(group){
			var groupID = group.get("id");

			var usersInvite = self.groupMembers[groupID].get(app.groupplaner.AuthStore.getUserEmail());
			if(usersInvite && usersInvite.get("invitationState") === "INVITED") {
				groupsStatus[groupID] = {
					status: "yellow",
					text: "eingeladen von: " + usersInvite.get("invitedBy")
				};
			} else {
				var nextDate = self.groupDates[groupID].getNextDate();
				if(nextDate !== null) {
					groupsStatus[groupID] = {
						status: "green",
						text: "Nächster Termin: " + app.groupplaner.DateConverter.apiDateIntToFormattedDateObj(nextDate)
					};
				} else {
					groupsStatus[groupID] = {
						status: "green",
						text: "Keine Termine anstehend"
					};
				}
			}
		});

		return groupsStatus;
	}

});