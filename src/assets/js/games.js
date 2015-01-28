(function (models) {

	var gamesPages;
	var gameListView = Backbone.View.extend({

		events: {
			'click .js-add-game': 'addGame',
		},

		addGame: function (ev) {
			gamesPages.changePage('gameform');
		}, 
		
		render: function () {
			var template = $("#game-list-template").html(),
				uid = app.viewstate.get('user').id,
				myGames = this.collection.filter(function(model) {
					return _.some(model.get('players'), function (player) { return player.playerId == uid; });
				});

			var html = Mustache.render(template, { 
				games: new Backbone.Collection(myGames).toJSON()
			});
			this.$el.html(html);
		},
		initialize: function () {
			this.render();
			this.collection.on('all', _.bind(this.render, this));
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
			var user = app.viewstate.get('user');
			if (!data.courseId) {
				console.error("Did not select a course");
				return false;
			}
			if (!user) {
				console.error("YOu need to be signed in");
				return false;
			}

			var course = this.courses.get(data.courseId);

			this.collection.create({
				course: course.toJSON(),
				date: moment().format("MM.DD.YYYY - h:mm a"),
				owner: user.id,
				players: [{
					playerId: user.id,
					name: user.displayName,
					scores: []
				}]
			});
			gamesPages.changePage('gamelist');
			return false;
		},

		render: function () {
			var self = this;
			var template = $("#game-form-template").html();
			var html = Mustache.render(template, {
				courses: self.courses.toJSON()
			});
			this.$("form").html(html);
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

		initialize: function () {
			var self = this;
			self.allCourses = new models.fbCourseCollection();
			app.location.getLocation().done(function (loc) {
				self.location = loc;
				self.bindLocalCourses();
			})
			.fail(function () {
				self.bindAllCourses();
			});
		}
	});

	app.games = {};
	app.games.init = function () {
		gamesPages = new app.pageChanger({
			el: "#game-pages"
		});
		gamesPages.changePage('gamelist');
		var collection = new models.fbGameCollection();
		var listView = new gameListView({
			el: $("#game-list"),
			collection: collection
		});
		var formView = new gameFormView({
			el: $("#game-form"),
			collection: collection
		})
	};
})(app.models);