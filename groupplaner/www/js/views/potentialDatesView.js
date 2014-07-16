app.groupplaner.PotentialDatesView = Backbone.View.extend({
	dates: new app.groupplaner.PotentialDatesCollection(),

	initialize: function (options) {
		if (options && options.groupId) {
			this.groupId = options.groupId;

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

		this.generateDivs(this.el);

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

	generateDivs: function (parent) {
		var self = this;
		_.each(this.preparedDates, function (date) {
			var weekday = Math.floor(date.start / app.groupplaner.DateConverter.minutesPerDay);
			var timespanInMinutes = date.end - date.start;

			var backgroundColor = "transparent", label = "", color = "white";
			if (date.priority > 0) {
				var transparency = date.priority / 10;
				backgroundColor = "rgba(0,255,0," + transparency + ")";
				label = "guter Termin";
				color = "black";
			} else if (_.contains(date.traits, "ACCEPTED_DATE")) {
				backgroundColor = "rgb(0,0,255)";
				label = "Gruppentermin";
			} else if (date.priority < 0) {
				var transparency = (date.priority * -1) / 10;
				backgroundColor = "rgba(255,0,0," + transparency + ")";
				label = "schlechter Termin";
			}

			$(parent).find("#container-" + weekday).append(
					"<div data-date-start='" + date.start + "' " +
					"data-date-end='" + date.end + "' " +
					"data-date-prio='" + date.priority + "' " +
						"style='height: " + timespanInMinutes + "px; background-color: " + backgroundColor + "; color: " + color + "' " +
						"class='timetable-date'>" + label + "</div>"
			).click(function (event) {
					var start = parseInt($(event.target).attr("data-date-start"));
					var end = parseInt($(event.target).attr("data-date-end"));
					var prio = parseInt($(event.target).attr("data-date-prio"));
					var clickedTimeInMinutes = event.pageY - this.offsetTop;
					self.createNewDateForClickedTime(weekday, clickedTimeInMinutes, start, end, prio);
				});
		});
	},

	createNewDateForClickedTime: function (weekday, clickedTimeInMinutes, dateStart, dateEnd, datePriority) {
		if (datePriority <= 0) {
			var weekdayOffset = weekday * 24 * 60;
			dateStart = weekdayOffset + clickedTimeInMinutes;
			dateEnd = dateStart + 60;
		}

		var url = "group/" + this.groupId + "/newAcceptedDate?start=" + dateStart + "&end=" + dateEnd;
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