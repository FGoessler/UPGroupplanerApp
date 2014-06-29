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
			var start = app.groupplaner.DateConverter.apiDateIntToObj(date.start);
			var end = app.groupplaner.DateConverter.apiDateIntToObj(date.end);

			if (end.hour === 0) end.hour = 24;
			var timespanHours = end.hour - start.hour;
			var timespanMinutes;
			if (end.minute >= start.minute) {
				timespanMinutes = end.minute - start.minute;
			} else {
				timespanMinutes = (end.minute + 60) - start.minute;
				timespanHours--;
			}
			var timespanInMinutes = timespanHours * 60 + timespanMinutes;

			var backgroundColor = "grey";
			if (date.priority > 0) {
				backgroundColor = "green";
			} else if (date.priority < 0) {
				backgroundColor = "red";
			}

			$("#container-" + start.weekday).append(
					"<div style='height: " + timespanInMinutes + "px; background-color: " + backgroundColor + ";' class='timetable-date'></div>"
			).click(function (event) {
					var clickedTimeInMinutes = event.pageY - this.offsetTop;
					self.createNewDateForClickedTime(clickedTimeInMinutes);
				});
		});
	},

	createNewDateForClickedTime: function (clickedTimeInMinutes) {
		//TODO: determine matching time period
		var start = 11030;
		var end = 11130;

		var url = "group/" + this.groupId + "/newAcceptedDate?start=" + start + "&end=" + end;
		app.groupplaner.launcher.router.navigate(url, {trigger: true});
	},


	splitMulidayDate: function (date) {
		var weekdayStart = Math.floor(date.start / 10000);
		var weekdayEnd = Math.floor(date.end / 10000);

		if (weekdayStart < weekdayEnd) {
			var newDate1 = $.extend(true, {}, date);
			newDate1.end = weekdayStart * 10000 + 2359;
			var newDate2 = $.extend(true, {}, date);
			newDate2.start = (weekdayStart + 1) * 10000;
			return [newDate1].union(this.splitMulidayDate(newDate2));
		} else {
			return [date];
		}
	}

});