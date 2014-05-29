app.groupplaner.AppRouter = Backbone.Router.extend({

	routes:{
		"":"home",
		"group/:id":"groupPage",
		"page2":"page2"
	},

	initialize:function () {
		// Handle back button throughout the application
		$('.back').on('click', function(event) {
			window.history.back();
			return false;
		});
		this.firstPage = true;
	},

	home:function () {
		this.changePage(new app.groupplaner.GroupsView());
	},

	groupPage:function (id) {
		this.changePage(new app.groupplaner.GroupView({groupId:id}));
	},

	page2:function () {
		this.changePage(new Page2View());
	},

	changePage:function (page) {
		$(page.el).attr('data-role', 'page');
		page.render();
		$('body').append($(page.el));
		var transition = $.mobile.defaultPageTransition;
		// We don't want to slide the first page
		if (this.firstPage) {
			transition = 'none';
			this.firstPage = false;
		}
		$.mobile.changePage($(page.el), {changeHash:false, transition: transition});
	}

});