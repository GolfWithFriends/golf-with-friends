(function (app, models) {


	var holeView = Backbone.View.extend({
		template: $("#hole-template").html(),

		events: {
			'click .js-listen': 'startListening',
			'click .js-stop-listen': 'stopListening'
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
			var data = {
				holeNum: self.holeNum,
				totalHoles: self.course.get('holes').length,
				hole: self.hole
			};
			var html = Mustache.render(this.template, data);
			this.$el.html(html);
			this.$sbw = this.$(".speech-button-wrap");
			app.loader.hide();
		},

		setScore: function (score) {
			this.$("input").val(score);
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