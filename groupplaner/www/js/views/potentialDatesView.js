app.groupplaner.PotentialDatesView = Backbone.View.extend({
	dates: new app.groupplaner.PotentialDatesCollection(),

	events: {

	},

	initialize: function (options) {
		if (options && options.groupId) {
			this.groupId = options.groupId;

			this.listenTo(this.dates, 'change', this.render);
			this.listenTo(this.dates, 'add', this.render);
			this.listenTo(this.dates, 'remove', this.render);
			this.listenTo(this.dates, 'sync', this.render);
			this.dates.groupId = this.groupId;
			this.dates.fetch();
		}
	},

	render: function () {
		$.mobile.loading().loader("hide");
		var template = app.groupplaner.templateCache.renderTemplate("potentialDatesView", {
			groupId: this.groupId,
			dates: this.dates.toJSON()
		});
		$(this.el).html(template);
		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	}

});