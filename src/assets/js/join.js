(function (models) {
	"use strict";

	function redirectToGame(game) {
		window.location = "/game.html?game=" + game.id;
	}

	var joinView = Backbone.View.extend({

		events: {
			'click .js-join': 'joinGame'
		},

		joinGame: function (ev) {
			var user = this.user;
			var game = this.game;
			var players = game.get('players');
			players.push({
				playerId: user.id,
				name: user.displayName,
				scores: []
			});

			game.set('players', players);
			game.save().done(function () {
				redirectToGame(game);
			});
		},

		render: function () {
			var html = "";
			var template = "";
			var data = {};
			if (!this.user) {
				template = $("#join-nouser-template").html();
				data = {};
			}
			else {
				template = $("#join-template").html();
				data = this.game.toJSON();
			}
			this.$el.html(Mustache.render(template, data));
		},

		bind: function (o) {
			this.game = o.game;
			this.user = o.user;
			this.render();
		},

		initialize: function (o) {

		}
	});


	app.join = {};
	app.join.init = function () {
		var self = this;
		var currentUrl = parseUri(window.location.toString());
		var gameId = currentUrl.queryKey['game'];
		var jv = new joinView({
			el: '#join-wrap'
		});

		if (!gameId) {
			window.location = "/";
		}

		var game = new models.fbGameModel(gameId);
		game.on('sync', function() {
			var user = app.viewstate.get('user');
			if (user) {
				var players = game.get('players');
				var alreadyIn = _.findWhere(players, { playerId: user.id });
				if (alreadyIn) {
					redirectToGame(game);
					return;
				}
			}
			jv.bind({
				user: user,
				game: game
			});

		});
	};
})(app.models);