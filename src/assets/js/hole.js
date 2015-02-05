(function (app, models) {

	if (annyang) {
		var speechCommands = {
			":v": function(v) {
				log(v);
			}
		}
		annyang.addCommands(speechCommands);
	}

	var holeView = Backbone.View.extend({
		template: $("#hole-template").html(),

		events: {
			'mousedown .js-listen': 'startListening',
			'mouseup .js-listen': 'stopListening'
		},

		startListening: function() {
			annyang.abort();
			annyang.start({ autoRestart: false });
			this.hasBeenStarted = true;
		},

		stopListening: function () {
			if (this.hasBeenStarted) {
				annyang.abort();
			}
			this.hasBeenStarted = false;
		},

		render: function () {
			var self = this;
			var data = {
				holeNum: self.holeNum,
				totalHoles: self.course.get('holes').length,
				hole: self.hole
			};
			var html = Mustache.render(this.template, data);
			this.$el.html(html);
			app.loader.hide();
		},

		initialize: function (o) {
			this.game = o.game;
			this.holeNum = o.holeNum;
			this.course = o.course;
			this.hole = o.course.get('holes')[this.holeNum];
			this.render();
		}
	});

	app.hole = {};
	app.hole.init = function () {
		var url = parseUri(window.location.toString());
		var gameId = url.queryKey['game'];
		var holeNum = url.queryKey['hole'];

		var currentHoleView;
		var game = new models.fbGameModel(gameId);
		game.once('sync', function () {
			var course = new models.fbCourseModel(game.get('course').id);
			currentHoleView = new holeView({
				game: game,
				course: course,
				holeNum: holeNum,
				el: $("#hole-view")
			});
		});
	};

})(app, app.models);