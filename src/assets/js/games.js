(function (app, models) {


	var transitionEndEvent = window.transitionEndEventName();
	var gamesPages;
	var gameListView = Backbone.View.extend({

		events: {
			'click .js-add-game': 'addGame',
			'click .game-list li': 'gameSelect',
			'click .join-link': 'showJoinLink',
			'swipeleft .game-list li': 'gameSwipe',
			'swiperight .game-list li': 'gameSwipe'
		},

		gameSwipe: function (ev) {
			this.isSwiping = true;
			var evType = ev.type.replace("swipe", ""),
				li = $(ev.currentTarget);

			li.addClass("remove-" + evType);
			li.one(transitionEndEvent, function() {
				li.slideUp();
			});
		},

		showJoinLink: function (ev) {
			var link = $(ev.currentTarget).data('link');
			swal({
				title: "Here's the join link!",
				html: true,
				text: "Copy this link and send it to your friends:<br /><a href='" + link + "'>" + link + "</a>"
			});
			ev.preventDefault();
			ev.stopPropagation();
		},

		gameSelect: function (ev) {
			if (this.isSwiping) {
				this.isSwiping = false;
				return false;
			}
			var li = $(ev.currentTarget);
			window.location = '/app/game.html?game=' + li.data('gameid');
		},

		addGame: function (ev) {
			gamesPages.changePage('gameform');
		}, 
		
		render: function (ev, ev2, ev3) {
			var template = $("#game-list-template").html(),
				uid = this.user.id;
				// myGames = this.collection.filter(function (model) {
				// 	return _.some(model.get('players'), function (player) { return player.playerId == uid; });
				// });

			var self = this;
			var html = Mustache.render(template, { 
				games: self.collection.toJSON()
			});
			this.$el.html(html);
			app.loader.hide();
		},
		initialize: function (o) {
			this.user = o.user;
			this.collection.on('sync add remove', _.debounce(_.bind(this.render, this), 300));
			if (this.collection.length) {
				this.render();
			}
		}
	});

	var gameFormView = Backbone.View.extend({

		events: {
			'submit form': 'formSubmit',
			'click .cancel': 'cancel',
			'click .js-all': 'bindAllCourses',
			'click .js-local': 'bindLocalCourses'
		},

		cancel: function (ev) {
			gamesPages.changePage('gamelist');
		},

		formSubmit: function (ev) {
			var form = $(ev.currentTarget);
			var data = form.serializeObject();
			var user = this.user;
			if (!data.courseId) {
				console.error("Did not select a course");
				return false;
			}
			if (!user) {
				console.error("YOu need to be signed in");
				return false;
			}

			var course = this.courses.get(data.courseId);
			var now = moment();
			var newGame = this.allGames.create({
				course: course.toJSON(),
				dateStr: now.format("MM.DD.YYYY - h:mm a"),
				timestamp: now.unix(),
				owner: user.id,
				players: [{
					playerId: user.id,
					name: user.getDisplayData().displayName,
					scores: []
				}]
			});

			var userGames = user.addGame(newGame.id);
			gamesPages.changePage('gamelist');
			return false;
		},

		render: function () {
			var self = this;
			var template = $("#game-form-template").html();
			var html = Mustache.render(template, {
				courses: self.courses.toJSON()
			});
			this.$("select").cselect("destroy");
			this.$("form").html(html);
			this.$("select").cselect({
				sizeToContent: true,
				buttonClass: 'fa fa-chevron-down',
			});
		},

		bindAllCourses: function () {
			var self = this;
			self.courses = self.allCourses;
			self.allCourses.on('sync', _.bind(self.render, self));
			self.render();

			$(".js-local").show();
			$(".js-all").hide();
		},

		bindLocalCourses: function () {
			var self = this;
			if (!self.localCourses) {
			var loc = self.location;
				self.localCourses = new models.fbCourseByLocationCollection(loc.state, loc.county);
			}
			self.courses = self.localCourses;
			self.localCourses.on('sync', _.bind(self.render, self));
			self.render();

			$(".js-all").show();
			$(".js-local").hide();
		},

		initialize: function (o) {
			var self = this;
			self.user = o.user;
			self.allCourses = new models.fbCourseCollection();
			self.allGames = new models.fbGameCollection();
			app.location.getLocation().done(function (loc) {
				self.location = loc;
				self.bindLocalCourses();
			})
			.fail(function () {
				self.bindAllCourses();
			});
		}
	});

	function init (user) {
		gamesPages = new app.pageChanger({
			el: "#game-pages"
		});
		gamesPages.changePage('gamelist');
		var collection = new models.gameCollectionByIds(user.get('games') || []);
		var listView = new gameListView({
			el: $("#game-list"),
			collection: collection,
			user: user
		});
		var formView = new gameFormView({
			el: $("#game-form"),
			collection: collection,
			user: user
		})
	}

	app.games = {};
	app.games.init = function () {
		var u = app.auth.user;
		if (u) {
			u.on('sync', function() {
				init(u);
			});
		}
		else {
			// this user stuff can be removed when the backbone user object is stored in the viewstate
			// app.viewstate.on('set:user', function(vs, u) {
   //              init(u);
			// });
		}
	};
})(app, app.models);