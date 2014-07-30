app.groupplaner.PotentialDatesView = Backbone.View.extend({
	dates: new app.groupplaner.PotentialDatesCollection(),

	events: {
		"click #backBtn": "goBack"
	},

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

		this.restoreScrollPosition(this.el);

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

			var backgroundColor = "transparent", label = "", color = "white", id = 0;
			if (date.priority > 0) {
				var transparency = date.priority / 10;
				backgroundColor = "rgba(34,134,52," + transparency + ")";
				if (date.priority >= 10) {
					label = "optimaler Termin";
				} else {
					label = "guter Termin";
				}
				//color = "black";
			} else if (date.traits.ACCEPTED_DATE) {
				backgroundColor = "rgb(38,87,133)";
				label = "Gruppentermin";
				id = date.traits.ACCEPTED_DATE;
			} else if (date.priority < 0) {
				var transparency = (date.priority * -1) / 10;
				backgroundColor = "rgba(195,38,25," + transparency + ")";
				var numberOfBlockedUsersForDate = date.traits.BLOCKED_DATE.length;
				if (numberOfBlockedUsersForDate) {
					label = "schlechter Termin<br>(" + numberOfBlockedUsersForDate + " nicht verfügbar)";
				} else {
					label = "schlechter Termin";
				}
			}

			$(parent).find("#container-" + weekday).append(
					"<div data-date-start='" + date.start + "' " +
					"data-date-end='" + date.end + "' " +
					"data-date-prio='" + date.priority + "' " +
						"data-date-id='" + id + "' " +
						"style='height: " + timespanInMinutes + "px; background-color: " + backgroundColor + "; color: " + color + "' " +
						"class='timetable-date'>" + label + "</div>"
			).click(function (event) {
					var start = parseInt($(event.target).attr("data-date-start"));
					var end = parseInt($(event.target).attr("data-date-end"));
					var prio = parseInt($(event.target).attr("data-date-prio"));
					var dateId = parseInt($(event.target).attr("data-date-id"));
					var clickedTimeInMinutes = event.pageY - this.offsetTop;
					self.handleClickOnDate(weekday, clickedTimeInMinutes, start, end, prio, dateId);
				});
		});
	},

	handleClickOnDate: function (weekday, clickedTimeInMinutes, dateStart, dateEnd, datePriority, acceptedDateId) {
		this.saveScrollPosition();

		if (datePriority <= 0) {
			var weekdayOffset = weekday * 24 * 60;
			dateStart = weekdayOffset + clickedTimeInMinutes;
			dateEnd = dateStart + 60;
		}

		var url;
		if (acceptedDateId) {
			url = "group/" + this.groupId + "/acceptedDate/" + acceptedDateId;
		} else {
			url = "group/" + this.groupId + "/newAcceptedDate?start=" + dateStart + "&end=" + dateEnd;
		}
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
	},

	goBack: function () {
		localStorage.removeItem("potentialDatesViewScrollTop");
		localStorage.removeItem("potentialDatesViewScrollLeft");
		window.history.back();
	},

	saveScrollPosition: function () {
		var top = $(window).scrollTop();
		var left = $(".date-table-container").scrollLeft();
		localStorage.setItem("potentialDatesViewScrollTop", top);
		localStorage.setItem("potentialDatesViewScrollLeft", left);
	},

	restoreScrollPosition: function (parent) {
		var top = localStorage.getItem("potentialDatesViewScrollTop");
		var left = localStorage.getItem("potentialDatesViewScrollLeft");
		if (!top) top = 400;
		$(window).scrollTop(top);
		setTimeout(function () {
			$(".date-table-container").scrollLeft(left);
		}, 1000);
	}

});