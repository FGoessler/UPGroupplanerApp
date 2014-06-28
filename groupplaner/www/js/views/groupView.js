app.groupplaner.GroupView = Backbone.View.extend({
	group: null,
	members: null,

	events: {
		"click #leave-group-btn": "leaveGroup",
		"click #rename-group-btn": "renameGroup",
		"click #add-member-btn": "addMember",
		"click #accept-invite-btn": "acceptInvite",
		"click #decline-invite-btn": "declineInvite",
		"click .ui-icon-delete": "deleteMember",
		"click .ui-icon-mail": "mailMember"
	},

	initialize: function (options) {
		if (options && options.groupId) {
			this.group = new app.groupplaner.GroupModel({id: options.groupId});
			this.listenTo(this.group, "change", this.render);

			this.members = new app.groupplaner.MemberCollection();
			this.members.groupId = options.groupId;
			this.listenTo(this.members, "change", this.render);
			this.listenTo(this.members, 'add', this.render);
			this.listenTo(this.members, 'remove', this.render);
			this.listenTo(this.members, 'sync', this.render);

			this.dates = new app.groupplaner.AcceptedDatesCollection();
			this.dates.groupId = options.groupId;
			this.listenTo(this.dates, "change", this.render);
			this.listenTo(this.dates, 'add', this.render);
			this.listenTo(this.dates, 'remove', this.render);
			this.listenTo(this.dates, 'sync', this.render);

			this.group.fetch();
			this.members.fetch();
			this.dates.fetch();
		}
	},

	render: function (eventName) {
		$(this.el).html(app.groupplaner.templateCache.renderTemplate("groupView", {
			group: this.group.toJSON(),
			members: this.members.toJSON(),
			dates: this.dates.toJSON(),
			userEmail: app.groupplaner.AuthStore.getUserEmail(),
			pendingInvite: this.isUsersInvitePending() ? this.isUsersInvitePending().toJSON() : false
		}));
		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	},

	/* ------------------------------------------------------------------------------------------- */
	/* manage members */
	/* ------------------------------------------------------------------------------------------- */

	addMember: function () {
		var self = this;
		var promptCallback = function (result) {
			if (result.buttonIndex === 1) {
				// we need to send this request manually cause backbone would send a PUT instead of a POST request
				var options = {
					data: JSON.stringify({email: result.input1}),
					type: "POST",
					contentType: "application/json; charset=utf-8",
					headers: app.groupplaner.AuthStore.getAuthHeader()
				};
				$.ajax(app.groupplaner.config.baseUrl + '/group/' + self.group.id + '/member',
					options).done(function () {
						self.members.fetch();
					}).fail(function () {
						navigator.notification.alert("Einladen fehlgeschlagen.");
					});
			}
		};
		navigator.notification.prompt("Bitte geben Sie die E-Mail Adresse der Person ein, die Sie einladen möchten.", promptCallback, "Einladen", ["OK", "Abbrechen"]);
	},

	deleteMember: function (event) {
		var memberEmail = $(event.target).attr("data-member-email");
		var model = this.members.get(memberEmail);

		var self = this;
		var confirmHandler = function (button) {
			if (button === 1) {
				model.destroy().success(function () {
					self.members.remove(model)
				}).fail(function () {
					navigator.notification.alert("Die Person konnte nicht ausgeladen werden.");
				});
			}
		};
		navigator.notification.confirm("Die Person mit der E-Mail Adresse '" + memberEmail + "' wirklich ausladen?", confirmHandler, "Achtung", ["Ja", "Nein"]);
	},

	leaveGroup: function () {
		var model = this.members.get(app.groupplaner.AuthStore.getUserEmail());

		var self = this;
		var confirmHandler = function (button) {
			if (button === 1) {
				model.destroy().success(function () {
					self.members.remove(model);
					app.groupplaner.launcher.router.navigate("groups", {trigger: true});
				}).fail(function () {
					navigator.notification.alert("Verlassen der Gruppe fehlgeschlagen.");
				});
			}
		};
		navigator.notification.confirm("Wollen Sie diese Gruppe wirklich verlassen?", confirmHandler, "Achtung", ["Ja", "Nein"]);
	},

	mailMember: function (event) {
		var memberEmail = $(event.target).attr("data-member-email");
		window.location.href = "mailto:" + memberEmail;
	},

	/* ------------------------------------------------------------------------------------------- */
	/* manage group */
	/* ------------------------------------------------------------------------------------------- */

	renameGroup: function () {
		var self = this;
		var promptCallback = function (result) {
			if (result.buttonIndex === 1) {
				self.group.save({name: result.input1}, {wait: true,
					error: function () {
						navigator.notification.alert("Umbennen der Gruppe fehlgeschlagen.");
					}});
			}
		};
		navigator.notification.prompt("Bitte geben Sie den neuen Namen der Gruppe ein.", promptCallback, "Gruppe umbennen", ["OK", "Abbrechen"], this.group.get("name"));
	},

	/* ------------------------------------------------------------------------------------------- */
	/* manage invite */
	/* ------------------------------------------------------------------------------------------- */

	acceptInvite: function () {
		var self = this;
		var member = this.isUsersInvitePending();
		if (member) {
			member.save({invitationState: "ACCEPTED"}, {wait: true,
				error: function () {
					navigator.notification.alert("Bestätigen fehlgeschlagen.");
				},
				success: function () {
					self.members.fetch();
				}});
		}
	},

	declineInvite: function () {
		var self = this;
		var member = this.isUsersInvitePending();
		if (member) {
			member.save({invitationState: "REJECTED"}, {wait: true,
				error: function () {
					navigator.notification.alert("Ablehnen fehlgeschlagen.");
				},
				success: function () {
					self.members.fetch();
				}});
		}
	},

	isUsersInvitePending: function () {
		var userEmail = app.groupplaner.AuthStore.getUserEmail();
		return this.members.find(function (member) {
			return member.get("email") === userEmail && member.get("invitationState") === "INVITED";
		});
	}
});
