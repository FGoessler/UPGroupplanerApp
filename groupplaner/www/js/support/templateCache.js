app.groupplaner.templateCache = {
	
	requireTemplate: function(templateName) {
		var template = $('#template_' + templateName);
		if (template.length === 0) {
			var tmpl_url = './templates/' + templateName + '.html';
			var tmpl_string = '';

			$.ajax({
				url: tmpl_url,
				method: 'GET',
				async: false,
				contentType: 'text',
				success: function (data) {
					tmpl_string = data;
				}
			});

			$('head').append('<script id="template_' +
				templateName + '" type="text/template">' + tmpl_string + '<\/script>');
		}
	},

	/**
	 * Loads the template with the given name from the templates directory and renders it via underscore.
	 * @param templateName The name of teh template file in the templates directory without ".html" suffix.
	 * @param data The data as passed in to _.template .
	 * @param settings The settings as passed in to _.template .
	 * @returns {*} The rendered template string.
	 */
	renderTemplate: function(templateName, data, settings) {
		this.requireTemplate(templateName);
		return _.template($('#template_' + templateName).html(), data, settings)
	}
	
};
