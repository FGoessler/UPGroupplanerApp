app.groupplaner.DateConverter = {

	minutesPerDay: 24 * 60,

	apiDateIntToFormattedDateObj: function (apiDate) {
		var weekdayNr = Math.floor(apiDate / this.minutesPerDay);
		var weekdayTable = {0: "Mo", 1: "Di", 2: "Mi", 3: "Do", 4: "Fr", 5: "Sa", 6: "So"};

		var hour = Math.floor((apiDate - weekdayNr * this.minutesPerDay) / 60);
		var minute = apiDate - weekdayNr * this.minutesPerDay - hour * 60;
		return {
			weekday: weekdayTable[weekdayNr],
			time: hour.pad(2) + ":" + minute.pad(2)
		}
	},

	apiDateIntToObj: function (apiDate) {
		var weekday = Math.floor(apiDate / this.minutesPerDay);
		var hour = Math.floor((apiDate - weekday * this.minutesPerDay) / 60);
		var minute = apiDate - weekday * this.minutesPerDay - hour * 60;
		return {
			weekday: weekday,
			hour: hour,
			minute: minute
		}
	},

	formattedDateObjToApiDateInt: function (formattedDate) {
		var weekdayNrTable = {"Mo": 0, "Di": 1, "Mi": 2, "Do": 3, "Fr": 4, "Sa": 5, "So": 6};
		var components = formattedDate.time.split(":");
		return weekdayNrTable[formattedDate.weekday] * this.minutesPerDay + parseInt(components[0]) * 60 + parseInt(components[1]);
	}

};
