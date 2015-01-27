(function() {
	var getParameterByName = function (name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	var game = new(Backbone.Firebase.Model.extend({
		url: app.fbRoot + 'games/' + getParameterByName('game')
	}))();

	var playerModel = Backbone.Model.extend({
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

	var gameView = Backbone.View.extend({
		template: $("#scorecard-template").html(),

		events: {
			'click .hole-score': 'holeClick'
		},

		holeClick: function (ev) {
			var target = $(ev.currentTarget),
				pid = target.closest('tr').data('id'),
				players = this.model.get('players'),
				thisPlayer = _.findWhere(players, { 'playerId': pid });

			var hole = target.index();
			var score = prompt('Enter hole ' + hole + ' score for ' + thisPlayer.name + '.');

			if (!!score && _.isNumber(parseInt(score)) && !_.isNaN(parseInt(score))) {
				thisPlayer.scores[hole - 1] = parseInt(score);
				game.save();
			}
		},

		updateScore: function() {
			var players = this.model.get('players'),
				parScore = this.model.get('course').holes.reduce(function(memo, model) { return memo + (model.par); }, 0),
				self = this;

			this.$('.player-row').each(function() {
				var player = _.findWhere(players, { 'playerId': $(this).data('id') }),
					total = player.scores.reduce(function (memo, score) { return parseInt(memo) + parseInt(score); }, 0);

				$(this).find('.score-total').html(total);
				// this.$('.score-rel').val(total - parScore);
			});
		},

		addScoresToPlayer: function (player) {
			var holes = this.model.get('course').holes;
			player.scores = [];
			_.each(holes, function (hole) {
				player.scores.push(0);
			});
		},

		render: function () {
			var html = Mustache.render(this.template, this.model.toJSON());
			this.$el.html(html);

			this.updateScore();
		},
		initialize: function() {
			var players = this.model.get('players'),
				self = this;

			_.each(players, function (player) {

				log(player);
				if (!player.scores || player.scores.length == 0) {
					self.addScoresToPlayer(player);
				}
			});

			this.render();

			this.model.on('sync add remove', _.bind(this.render, this));
		}
	});

	app.scorecard = {};

	app.scorecard.init = function() {
		game.once('sync', function () {
			app.scorecard.game = game;
			app.scorecard.view = new gameView({
				el: $(".scorecard"),
				model: game
			});
		});
	};
})();