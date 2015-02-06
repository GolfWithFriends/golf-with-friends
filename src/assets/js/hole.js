(function (app, models) {


	var holeView = Backbone.View.extend({
		template: $("#hole-template").html(),

		events: {
			'click .js-listen': 'startListening',
			'click .js-stop-listen': 'stopListening',
			'focus input': 'inputFocus',
			'change input': 'inputChange'
		},

		inputChange: function (ev) {
			var val = $(ev.currentTarget).val();
			this.player.scores[this.holeNum] = parseInt(val, 10);
			this.game.save();
		},

		inputFocus: function (ev) {
			$(ev.currentTarget).select();
		},

		startListening: function() {
			annyang.start({ autoRestart: false });
			this.$sbw.toggleClass("listening");
		},

		stopListening: function () {
			annyang.abort();
			this.$sbw.toggleClass("listening");
		},

		render: function () {
			var self = this;
			var courseHoles = self.course.get('holes');
			var hasNext = self.holeNum !== (courseHoles.length - 1);
			var hasPrev = self.holeNum !== 0;
			var data = {
				holeNum: self.holeNum,
				holeDisplay: self.holeNum + 1,
				totalHoles: courseHoles.length,
				hole: self.hole,
				game: self.game,
				score: self.player.scores[self.holeNum],
				hasPrev: hasPrev,
				hasNext: hasNext,
				nextHole: self.holeNum + 1,
				prevHole: self.holeNum - 1
			};
			var html = Mustache.render(this.template, data);
			this.$el.html(html);
			this.$sbw = this.$(".speech-button-wrap");
			app.loader.hide();
		},

		setScore: function (score) {
			this.$("input").val(score).trigger('change');
		},

		onSayScore: function (v) {
			var score = '';
			var hole = this.hole;
			switch (v) {
				case "birdy":
					score = hole.par - 1;
					break;
				case "par":
					score = hole.par;
					break;
				case "bogey":
					score = hole.par + 1;
					break;
				default:
					score = v;
					break;
			}

			if (!isNaN(score)) {
				this.setScore(score);
			}
			this.stopListening();
		},

		initAnnyang: function() {
			var speechCommands = {
				":v": _.bind(this.onSayScore, this)
			}
			annyang.addCommands(speechCommands);
			/*
			annyang.addCallback("start", function (r) {
				log('start', r);
			});
			annyang.addCallback("result", function (r) {
				log('result', r);
			});
			annyang.addCallback("resultMatch", function (r) {
				log('resultMath', r);
			});
			annyang.addCallback("end", function (r) {
				log('end', r);
			});
			*/
		},

		initialize: function (o) {
			this.game = o.game;
			this.holeNum = o.holeNum;
			this.course = o.course;
			this.hole = o.course.get('holes')[this.holeNum];
			var currentPlayer = _.findWhere(this.game.get('players'), { playerId: app.viewstate.get('user').id });
			this.player = currentPlayer;
			this.render();
			if (annyang) {
				this.initAnnyang();
			}
		}
	});

	app.hole = {};
	app.hole.init = function () {
		var url = parseUri(window.location.toString());
		var gameId = url.queryKey['game'];
		var holeNum = parseInt(url.queryKey['hole'], 10);

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