(function (models) {

	models.fbGameModel = function (id) {
		return new (Backbone.Firebase.Model.extend({
			url: app.fbRoot + 'games/' + id
		}))();
	};

	models.playerModel = Backbone.Model.extend({
		defaults: {
			gameId: '',
			scores: _.range(1, 19)
		},
		toJSON: function() {
			return _.extend({}, this.attributes, {
				cid: this.cid
			});
		},
		toTemplateJSON: function() {
			var json = this.toJSON();

			json.total = this.get('scores').reduce(function(memo, score) { return memo + score; }, 0);

			return json;
		}
	});

	models.fbGameCollection = Backbone.Firebase.Collection.extend({
		url: app.fbRoot + 'games'
	});

	models.gameCollectionByIds = function (ids) {
		if (!_.isArray(ids)) {
			ids = [ids];
		}
		var games = _.map(ids, function (i) {
			return new models.fbGameModel(i);
		});

		// todo - this isn't working yet because the games aren't syncd.  Timestamp isn't set yet.
		// There might be a better way to get a collection of items by Id
		// or maybe we shoudlnt' be doing it.
		var ordered = _.sortBy(games, function (g) {
			return -1 * g.get('timestamp');
		});

		var collection = new Backbone.Collection(ordered);
		setTimeout(function () {
			collection.trigger('sync');
		}, 1);
		return collection;
		// todo - this isn't a game collection.  We don't have a need for one yet.
	};

})(app.models);