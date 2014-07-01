app.groupplaner.PotentialDatesView = Backbone.View.extend({
	dates: new app.groupplaner.PotentialDatesCollection(),

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
		this.splitMultidayDates();
		this.sortDates();

		$.mobile.loading().loader("hide");
		var template = app.groupplaner.templateCache.renderTemplate("potentialDatesView", {
			groupId: this.groupId
		});
		$(this.el).html(template);
		$("body").trigger('create');	//trigger jQueryMobile update

		this.generateDivs();

		return this;
	},


	splitMultidayDates: function () {
		this.preparedDates = [];
		var self = this;
		_.each(this.dates.toJSON(), function (date) {
			self.preparedDates = self.preparedDates.union(self.splitMulidayDate(date));
		});
	},

	sortDates: function () {
		this.preparedDates = _.sortBy(this.preparedDates, "start");
	},

	generateDivs: function () {
		var self = this;
		_.each(this.preparedDates, function (date) {
			var weekday = Math.floor(date.start / app.groupplaner.DateConverter.minutesPerDay);
			var timespanInMinutes = date.end - date.start;

			var backgroundColor = "grey";
			if (date.priority > 0) {
				backgroundColor = "green";
			} else if (date.priority < 0) {
				backgroundColor = "red";
			}

			$("#container-" + weekday).append(
					"<div style='height: " + timespanInMinutes + "px; background-color: " + backgroundColor + ";' class='timetable-date'></div>"
			).click(function (event) {
					var clickedTimeInMinutes = event.pageY - this.offsetTop;
					self.createNewDateForClickedTime(weekday, clickedTimeInMinutes);
				});
		});
	},

	createNewDateForClickedTime: function (weekday, clickedTimeInMinutes) {
		//TODO: determine matching time period
		var weekdayOffset = weekday * 24 * 60;
		var start = weekdayOffset + clickedTimeInMinutes;
		var end = start + 60;

		var url = "group/" + this.groupId + "/newAcceptedDate?start=" + start + "&end=" + end;
		app.groupplaner.launcher.router.navigate(url, {trigger: true});
	},


	splitMulidayDate: function (date) {
		var weekdayStart = Math.floor(date.start / app.groupplaner.DateConverter.minutesPerDay);
		var weekdayEnd = Math.floor(date.end / app.groupplaner.DateConverter.minutesPerDay);

		if (weekdayStart < weekdayEnd) {
			var newDate1 = $.extend(true, {}, date);	//create copy
			newDate1.end = (weekdayStart + 1) * app.groupplaner.DateConverter.minutesPerDay - 1;
			var newDate2 = $.extend(true, {}, date);	//create copy
			newDate2.start = (weekdayStart + 1) * app.groupplaner.DateConverter.minutesPerDay;
			return [newDate1].union(this.splitMulidayDate(newDate2));
		} else {
			return [date];
		}
	}

});