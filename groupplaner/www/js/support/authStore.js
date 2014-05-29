app.groupplaner.AuthStore = {

	/**
	 * Returns true if there are any user credentials saved in the app and false otherwise.
	 * This method does not validate these credentials against the API!
	 * @returns {boolean} Loginstatus of the user.
	 */
	isUserLoggedIn: function() {
		if(this.getUserEmail()) {
			return true;
		} else {
			return false;
		}
	},
	
	getUserEmail: function () {
		return localStorage.getItem("user_email");
	},

	/**
	 * Use this method to validate if the passed user credentials are valid and log the user in.
	 * Pass a callback function as 3rd parameter. It'll be called with either a true or false value as first parameter
	 * indicating the validity of the user credentials.
	 * @param useremail The user's email.
	 * @param password The user's password.
	 * @param callback A callback function that takes one argument indicating the success status.
	 */
	login: function (useremail, password, callback) {
		var authHeader = this.getAuthHeader(useremail, password);
		$.ajax(app.groupplaner.config.baseUrl, {headers: authHeader})
			.done(function () {
				localStorage.setItem("user_email", useremail);
				localStorage.setItem("user_password", password);
				callback(true);
			}).fail(function () {
				callback(false);
			})
	},

	/**
	 * Provides the HTTP basic authentication header which is required to make calls to the API. 
	 * @param email Optional - The user's email address. If not set it will use the saved email address. 
	 * @param password Optional - The password. If not set it will use the saved password.
	 * @returns {{Authorization: string}}
	 */
	getAuthHeader: function (email, password) {
		email = email ? email : this.getUserEmail();
		password = password ? password : localStorage.getItem("user_password");
		return {Authorization: "Basic " + (email + ":" + password).encodeBase64()};
	}
};
