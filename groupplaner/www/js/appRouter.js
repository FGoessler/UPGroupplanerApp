app.groupplaner.AppRouter = Backbone.Router.extend({

	routes:{
		"":"start",
		"login": "loginPage",
		"groups":"groupsPage",
		"group/:id": "groupPage",
		"group/:id/potentialDates": "potentialDatesPage",
		"settings": "settings",
		"blockedDate/:id": "blockedDate",
		"newBlockedDate": "newBlockedDate"
	},

	initialize:function () {
		// Handle back button throughout the application
		$('.back').on('click', function(event) {
			window.history.back();
			return false;
		});
		this.firstPage = true;
	},

	start:function () {
		if(app.groupplaner.AuthStore.isUserLoggedIn()) {
			this.navigate("groups", {trigger:true});
		} else {
			this.navigate("login", {trigger:true});
		}
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