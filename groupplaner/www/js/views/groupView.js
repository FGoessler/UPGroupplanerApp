app.groupplaner.GroupView = Backbone.View.extend({
	group: null,
	members: null,
	dates: null,

	events: {
		"click #leave-group-btn": "leaveGroup",
		"click #rename-group-btn": "renameGroup",
		"click #add-member-btn": "addMember",
		"click #accept-invite-btn": "acceptInvite",
		"click #decline-invite-btn": "declineInvite",
		"click .delete-member": "deleteMember",
		"click .mail-member": "mailMember",
		"click .edit-date": "editDate",
		"click .delete-date": "deleteDate"
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
				$.mobile.loading().loader("show");
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
					}).always(function () {
						$.mobile.loading().loader("hide");
					});
			}
		};
		navigator.notification.prompt("Bitte geben Sie die Universitäts-E-Mail-Adresse der Person ein, die Sie einladen möchten.", promptCallback, "Einladen", ["OK", "Abbrechen"]);
	},

	deleteMember: function (event) {
		var memberEmail = $(event.target).attr("data-member-email");
		var model = this.members.get(memberEmail);

		var self = this;
		var confirmHandler = function (button) {
			if (button === 1) {
				$.mobile.loading().loader("show");
				model.destroy({wait: true}).success(function () {
					self.members.remove(model)
				}).fail(function () {
					navigator.notification.alert("Die Person konnte nicht ausgeladen werden.");
				}).always(function () {
					$.mobile.loading().loader("hide");
				});
			}
		};
		navigator.notification.confirm("Die Person mit der E-Mail-Adresse '" + memberEmail + "' wirklich ausladen?", confirmHandler, "Achtung", ["Ja", "Nein"]);
	},

	leaveGroup: function () {
		var model = this.members.get(app.groupplaner.AuthStore.getUserEmail());

		var self = this;
		var confirmHandler = function (button) {
			if (button === 1) {
				$.mobile.loading().loader("show");
				model.destroy({wait: true}).success(function () {
					self.members.remove(model);
					app.groupplaner.launcher.router.navigate("groups", {trigger: true});
				}).fail(function () {
					navigator.notification.alert("Verlassen der Gruppe fehlgeschlagen.");
				}).always(function () {
					$.mobile.loading().loader("hide");
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
				$.mobile.loading().loader("show");
				self.group.save({name: result.input1}, {wait: true,
					error: function () {
						navigator.notification.alert("Umbennen der Gruppe fehlgeschlagen.");
					},
					complete: function () {
						$.mobile.loading().loader("hide");
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
			$.mobile.loading().loader("show");
			member.save({invitationState: "ACCEPTED"}, {wait: true,
				error: function () {
					navigator.notification.alert("Beitreten fehlgeschlagen.");
				},
				success: function () {
					self.members.fetch();
				},
				complete: function () {
					$.mobile.loading().loader("hide");
				}});
		}
	},

	declineInvite: function () {
		var member = this.isUsersInvitePending();
		if (member) {
			$.mobile.loading().loader("show");
			member.save({invitationState: "REJECTED"}, {wait: true,
				error: function () {
					navigator.notification.alert("Ablehnen fehlgeschlagen.");
				},
				success: function () {
					app.groupplaner.launcher.router.navigate("groups", {trigger: true});
				},
				complete: function () {
					$.mobile.loading().loader("hide");
				}});
		}
	},

	isUsersInvitePending: function () {
		var userEmail = app.groupplaner.AuthStore.getUserEmail();
		return this.members.find(function (member) {
			return member.get("email") === userEmail && member.get("invitationState") === "INVITED";
		});
	},

	/* ------------------------------------------------------------------------------------------- */
	/* manage dates */
	/* ------------------------------------------------------------------------------------------- */

	deleteDate: function (event) {
		var dateId = $(event.target).attr("data-date-id");
		var model = this.dates.get(dateId);

		var self = this;
		var confirmHandler = function (button) {
			if (button === 1) {
				$.mobile.loading().loader("show");
				model.groupId = self.group.id;
				model.destroy({wait: true}).success(function () {
					self.dates.remove(model)
				}).fail(function () {
					navigator.notification.alert("Termin konnte nicht gelöscht werden.");
				}).always(function () {
					$.mobile.loading().loader("hide");
				});
			}
		};
		navigator.notification.confirm("Den Termin wirklich löschen?", confirmHandler, "Achtung", ["Ja", "Nein"]);
	},

	editDate: function (event) {
		var dateId = $(event.target).attr("data-date-id");
		app.groupplaner.launcher.router.navigate("group/" + this.group.id + "/acceptedDate/" + dateId, {trigger: true});
	}
});
