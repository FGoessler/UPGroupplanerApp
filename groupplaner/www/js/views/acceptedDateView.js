app.groupplaner.AcceptedDateView = Backbone.View.extend({
	date: null,

	events: {
		"click #submit-btn": "save"
	},

	initialize: function (options) {
		if (options && options.dateId) {
			this.date = new app.groupplaner.AcceptedDateModel({id: options.dateId});
			this.date.groupId = options.groupId;
			this.listenTo(this.date, "change", this.render);
			this.date.fetch();
		} else {
			this.date = new app.groupplaner.AcceptedDateModel({
				start: options.start,
				end: options.end
			});
			this.date.groupId = options.groupId;
			this.render();
		}
	},

	render: function () {
		var convertedDateObj;
		if (this.date) {
			var jsonDate = this.date.toJSON();
			convertedDateObj = {
				start: app.groupplaner.DateConverter.apiDateIntToFormattedDateObj(jsonDate.start),
				end: app.groupplaner.DateConverter.apiDateIntToFormattedDateObj(jsonDate.end)
			};
		}

		var template = app.groupplaner.templateCache.renderTemplate("acceptedDateView", {date: convertedDateObj});
		$(this.el).html(template);

		if (convertedDateObj) {
			$("input[name='from-weekday'][value='" + convertedDateObj.start.weekday + "']").attr("checked", "checked");
			$("input[name='to-weekday'][value='" + convertedDateObj.end.weekday + "']").attr("checked", "checked");
		}

		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	},

	save: function () {
		this.date.save({
			start: app.groupplaner.DateConverter.formattedDateObjToApiDateInt({weekday: $('input[name=from-weekday]:checked').val(), time: $("#from-time").val()}),
			end: app.groupplaner.DateConverter.formattedDateObjToApiDateInt({weekday: $('input[name=to-weekday]:checked').val(), time: $("#to-time").val()})
		}, {wait: true,
			error: function () {
				navigator.notification.alert("Speichern fehlgeschlagen.");
			},
			success: function () {
				window.history.back();
			}
		});
	}


});