app.groupplaner.BlockedDateView = Backbone.View.extend({
	date: null,

	events: {
		"click #submit-btn": "save",
		"click #delete-btn": "deleteDate"
	},

	initialize: function (options) {
		if (options && options.dateId) {
			this.date = new app.groupplaner.BlockedDateModel({id: options.dateId});
			this.listenTo(this.date, "change", this.render);
			this.date.fetch();
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

		var template = app.groupplaner.templateCache.renderTemplate("blockedDateView", {date: convertedDateObj, dateId: this.date.id});
		$(this.el).html(template);

		if (convertedDateObj) {
			$("input[name='from-weekday'][value='" + convertedDateObj.start.weekday + "']").attr("checked", "checked");
			$("input[name='to-weekday'][value='" + convertedDateObj.end.weekday + "']").attr("checked", "checked");
		}

		$("body").trigger('create');	//trigger jQueryMobile update
		return this;
	},

	save: function () {
		$.mobile.loading().loader("show");
		if (!this.date) this.date = new app.groupplaner.BlockedDateModel();
		this.date.save({
			source: app.groupplaner.config.sourcekey,
			start: app.groupplaner.DateConverter.formattedDateObjToApiDateInt({weekday: $('input[name=from-weekday]:checked').val(), time: $("#from-time").val()}),
			end: app.groupplaner.DateConverter.formattedDateObjToApiDateInt({weekday: $('input[name=to-weekday]:checked').val(), time: $("#to-time").val()})
		}, {wait: true,
			error: function () {
				navigator.notification.alert("Speichern fehlgeschlagen.");
			},
			success: function () {
				window.history.back();
			},
			complete: function () {
				$.mobile.loading().loader("hide");
			}
		});
	},

	deleteDate: function () {
		var self = this;
		var confirmHandler = function (button) {
			if (button === 1) {
				$.mobile.loading().loader("show");
				self.date.destroy({wait: true}).success(function () {
					window.history.back();
				}).fail(function () {
					navigator.notification.alert("Zeitraum konnte nicht gelöscht werden.");
				}).always(function () {
					$.mobile.loading().loader("hide");
				});
			}
		};
		navigator.notification.confirm("Den Zeitraum wirklich löschen?", confirmHandler, "Achtung", ["Ja", "Nein"]);
	}


});