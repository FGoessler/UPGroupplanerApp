app.groupplaner.DateConverter = {

	apiDateIntToFormattedDateObj: function (apiDate) {
		var weekdayNr = Math.floor(apiDate / 10000);
		var weekdayTable = {1: "Mo", 2: "Di", 3: "Mi", 4: "Do", 5: "Fr", 6: "Sa", 7: "So"};

		var hour = Math.floor((apiDate - weekdayNr * 10000) / 100);
		var minute = apiDate - weekdayNr * 10000 - hour * 100;
		return {
			weekday: weekdayTable[weekdayNr],
			time: hour.pad(2) + ":" + minute.pad(2)
		}
	},

	formattedDateObjToApiDateInt: function (formattedDate) {
		var weekdayNrTable = {"Mo": 1, "Di": 2, "Mi": 3, "Do": 4, "Fr": 5, "Sa": 6, "So": 7};
		var components = formattedDate.time.split(":");
		return weekdayNrTable[formattedDate.weekday] * 10000 + parseInt(components[0]) * 100 + parseInt(components[1]);
	}

};
