(function (app, models) {


	var holeView = Backbone.View.extend({
		template: $("#hole-view-template").html(),

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
			
			var data = {
				holeNum: self.holeNum,
				holeDisplay: self.holeNum + 1,
				totalHoles: this.totalHoles,
				hole: self.hole,
				game: self.game,
				score: self.player.scores[self.holeNum]
			};
			var html = Mustache.render(this.template, data);
			var el = $(html).appendTo(this.$pager);
			this.setElement(el);
			this.$sbw = this.$(".speech-button-wrap");
		},

		destroy: function () {

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
			//this.game = o.game;
			// this.course = o.course;
			// this.hole = o.course.get('holes')[this.holeNum];
			//var currentPlayer = _.findWhere(this.game.get('players'), { playerId: app.viewstate.get('user').id });
			//this.player = currentPlayer;
			
			this.holeNum = o.holeNum;
			this.hole = o.hole;
			this.totalHoles = o.totalHoles;
			this.player = o.player;
			this.game = o.game;
			this.$pager = o.pager;
			this.render();
			if (annyang) {
				this.initAnnyang();
			}
		}
	});

	var holePager = Backbone.View.extend({

		events: {
			'click .js-next-hole': 'showNextHole',
			'click .js-prev-hole': 'showPrevHole'
		},

		showPrevHole: function (ev) {
			this.currentHoleView.$el.addClass('next');
			if (this.prevHoleView) {
				this.prevHoleView.$el.removeClass('prev');
			}
			if (this.nextHoleView) {
				this.nextHoleView.destroy();
			}

			this.currentHoleNum--;
			this.nextHoleView = this.currentHoleView;
			this.currentHoleView = this.prevHoleView;
			this.renderPrev();
			this.updateNav();
		},

		showNextHole: function(ev) {
			this.currentHoleView.$el.addClass("prev");
			if (this.nextHoleView) {
				this.nextHoleView.$el.removeClass("next");
			}
			if (this.prevHoleView) {
				this.prevHoleView.destroy();
			}

			this.currentHoleNum++;
			this.prevHoleView = this.currentHoleView;
			this.currentHoleView = this.nextHoleView;
			this.renderNext();
			this.updateNav();
		},

		updateNav: function () {
			var self = this;
			log(self.currentHoles);
			var hasNext = self.currentHoleNum < (self.totalHoles - 1);
			var hasPrev = self.currentHoleNum > 0;
			this.$nav.find(".js-prev-hole").toggle(hasPrev);
			this.$nav.find(".js-next-hole").toggle(hasNext);
		},

		getHoleViewData: function (holeNum) {
			var holes = this.course.get('holes');
			var hole = holes[holeNum];
			var thisUser = app.viewstate.get('user');
			var thisPlayer = _.findWhere(this.game.get('players'), {
				playerId: thisUser.id
			});
			return {
				hole: hole,
				holeNum: holeNum,
				totalHoles: holes.length,
				player: thisPlayer,
				game: this.game,
			};
		},

		renderPrev: function () {
			var self = this;
			var holeData = this.getHoleViewData(this.currentHoleNum - 1);
			var viewData = _.extend(holeData, {
				pager: self.$el
			});
			this.prevHoleView = new holeView(viewData);
			this.prevHoleView.$el.addClass('prev');
		},

		renderCurrent: function () {
			var self = this;
			var holeData = this.getHoleViewData(this.currentHoleNum);
			var viewData = _.extend(holeData, {
				pager: self.$el
			});
			this.currentHoleView = new holeView(viewData);
			app.loader.hide();
		},

		renderNext: function() {
			var self = this;
			var holeData = this.getHoleViewData(this.currentHoleNum + 1);
			var viewData = _.extend(holeData, {
				pager: self.$el
			});
			this.nextHoleView = new holeView(viewData);
			this.nextHoleView.$el.addClass('next');
		},

		initialize: function (o) {
			this.game = o.game;
			this.course = o.course;
			this.currentHoleNum = o.holeNum;
			this.totalHoles = o.course.get('holes').length;
			this.$nav = this.$(".hole-nav");
			this.renderCurrent();
			this.renderNext();
			this.updateNav();
		}
	});

	app.hole = {};
	app.hole.init = function () {
		var url = parseUri(window.location.toString());
		var gameId = url.queryKey['game'];
		var holeNum = parseInt(url.queryKey['hole'] || 0, 10);
		var game = new models.fbGameModel(gameId);
		var pager;

		game.once('sync', function () {
			var course = new models.fbCourseModel(game.get('course').id);
			pager = new holePager({
				game: game,
				course: course,
				holeNum: holeNum,
				el: $('#hole-pager')
			});
		});
	};

})(app, app.models);