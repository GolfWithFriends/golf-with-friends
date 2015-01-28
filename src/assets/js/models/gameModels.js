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


})(app.models);