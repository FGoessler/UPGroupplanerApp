app.groupplaner.launcher = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		app.groupplaner.launcher.receivedEvent('deviceready');
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {
		// iOS7 Status Bar adjustment
		if (navigator.userAgent.match(/(iPad.*|iPhone.*|iPod.*);.*CPU.*OS 7_\d/i)) {
			$("body").addClass("ios7").append('<div id="ios7statusbar"/>');
		}
		$("body").append('<div class="ui-loader-background"/>');

		this.router = new app.groupplaner.AppRouter();
		Backbone.history.start({pushState: false});
	}
};
