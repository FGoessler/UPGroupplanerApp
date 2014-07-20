app.groupplaner.AppRouter = Backbone.Router.extend({

	routes:{
		"":"start",
		"firstStart": "firstStartPage",
		"login": "loginPage",
		"groups":"groupsPage",
		"group/:id": "groupPage",
		"group/:id/potentialDates": "potentialDatesPage",
		"settings": "settings",
		"blockedDate/:id": "blockedDate",
		"newBlockedDate": "newBlockedDate",
		"group/:groupId/acceptedDate/:id": "acceptedDate",
		"group/:groupId/newAcceptedDate?start=:start&end=:end": "newAcceptedDate"
	},

	initialize:function () {
		// Handle back button (android)
		document.addEventListener("backbutton", function (e) {
			if (Backbone.history.fragment == "start" || Backbone.history.fragment == "firstStart" || Backbone.history.fragment == "groups") {
				e.preventDefault();
				navigator.app.exitApp();
			}
			else {
				window.history.back();
			}
		}, false);
		this.firstPage = true;
	},

	start:function () {
		if(app.groupplaner.AuthStore.isUserLoggedIn()) {
			this.navigate("groups", {trigger:true});
		} else {
			this.navigate("firstStart", {trigger: true});
		}
	},

	firstStartPage: function () {
		this.changePage(new app.groupplaner.FirstStartView());
	},

	loginPage:function () {
		this.changePage(new app.groupplaner.LoginView());
	},

	groupsPage: function(){
		this.changePage(new app.groupplaner.GroupsView());
	},

	groupPage:function (id) {
		this.changePage(new app.groupplaner.GroupView({groupId:id}));
	},

	potentialDatesPage: function (id) {
		this.changePage(new app.groupplaner.PotentialDatesView({groupId: id}));
	},

	settings: function () {
		this.changePage(new app.groupplaner.SettingsView());
	},

	blockedDate: function (id) {
		this.changePage(new app.groupplaner.BlockedDateView({dateId: id}));
	},

	newBlockedDate: function () {
		this.changePage(new app.groupplaner.BlockedDateView());
	},

	acceptedDate: function (groupId, id) {
		this.changePage(new app.groupplaner.AcceptedDateView({
			dateId: id,
			groupId: groupId
		}));
	},

	newAcceptedDate: function (groupId, start, end) {
		this.changePage(new app.groupplaner.AcceptedDateView({
			groupId: groupId,
			start: start,
			end: end
		}));
	},

	changePage:function (page, transition) {
		$(page.el).attr('data-role', 'page');
		page.render();
		$('body').append($(page.el));
		transition = transition ? transition : $.mobile.defaultPageTransition;
		// We don't want to slide the first page
		if (this.firstPage) {
			transition = 'none';
			this.firstPage = false;
		}
		$.mobile.changePage($(page.el), {changeHash:false, transition: transition});
	}

});