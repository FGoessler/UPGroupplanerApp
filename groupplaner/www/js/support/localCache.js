(function () {

	var superMethods = {
		collectionFetch: Backbone.Collection.prototype.fetch,
		modelFetch: Backbone.Model.prototype.fetch,
		modelSync: Backbone.Model.prototype.sync
	};

	function keyForCollection(collection) {
		return _.isFunction(collection.url) ? collection.url() : collection.url;
	}

	function keyForModel(model) {
		var id = model.get(model.idAttribute ? model.idAttribute : model.id);
		return (_.isFunction(model.url) ? model.url() : model.url) + '/' + id;
	}


	Backbone.Collection.prototype.fetch = function (opts) {
		var key = keyForCollection(this);
		var deferred = new $.Deferred();
		var self = this;

		function loadFromCache() {
			var dataString = localStorage.getItem(key);
			if (dataString) {
				var data = JSON.parse(dataString);
				self.set(data);
			}
		}

		function saveToCache() {
			localStorage.setItem(key, JSON.stringify(self.toJSON()));
		}

		loadFromCache();

		superMethods.collectionFetch.apply(this, arguments)
			.done(_.bind(deferred.resolve, this, this))
			.done(_.bind(saveToCache, null, this, opts))
			.fail(_.bind(deferred.reject, this, this));

		return deferred;
	};


	Backbone.Model.prototype.fetch = function (opts) {
		var key = keyForModel(this);
		var deferred = new $.Deferred();
		var self = this;

		function loadFromCache() {
			var dataString = localStorage.getItem(key);
			if (dataString) {
				var data = JSON.parse(dataString);
				self.set(data);
			}
		}

		function saveToCache() {
			localStorage.setItem(key, JSON.stringify(self.toJSON()));
		}

		loadFromCache();

		superMethods.modelFetch.apply(this, arguments)
			.done(_.bind(deferred.resolve, this, this))
			.done(_.bind(saveToCache, null, this, opts))
			.fail(_.bind(deferred.reject, this, this));

		return deferred;
	};


	Backbone.Model.prototype.sync = function (method, model, options) {
		if (method === 'read') {	// only clean cache on modifying operations
			return superMethods.modelSync.apply(this, arguments);
		}

		localStorage.removeItem(keyForModel(model));
		if (model.collection) {
			localStorage.removeItem(keyForCollection(model.collection));
		}

		return superMethods.modelSync.apply(this, arguments);
	};

})();
