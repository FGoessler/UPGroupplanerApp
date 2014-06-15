// Perform some basic configuration so that jQueryMobile and Backbone play nice together.
$(document).on("mobileinit", function () {
	$.mobile.ajaxEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;
});

$(document).bind('pagechange', function () {
	$('div[data-role="page"]').bind('pagehide', function (event, ui) {
		$(event.currentTarget).remove();
	});
});
