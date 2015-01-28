(function (app, models) {
	var location;
	var courseListView = Backbone.View.extend({
		template: $("#course-list-template").html(),

		events: {
			'click .edit': 'edit',
			'click .delete': 'deleteCourse',
			'click .js-add-course': 'addCourse',
			'click .js-view-near': 'viewNear',
			'click .js-view-all': 'viewAll'
		},

		viewNear: function () {
			var self = this;
			self.$list.html("We're trying to get your location");
			app.location.getLocation().done(function (loc) {
				self.bindByLocation(loc);
			}).fail(function () {
				self.$list.html("We were unable to get your location. Sorry");
			});
			this.$(".js-view-near").hide();
			this.$(".js-view-all").show();
		},

		viewAll: function () {
			this.collection = this.allCollection;
			this.collection.on('sync add remove', _.bind(this.render, this));
			this.render();

			this.$(".js-view-all").hide();
			this.$(".js-view-near").show();
		},

		bindByLocation: function (loc) {
			var locationId = loc.state + '/' + loc.county;
			this.locationCollection = new models.fbCourseByLocationCollection(loc.state, loc.county);
			this.collection = this.locationCollection;
			this.collection.on('sync add remove', _.bind(this.render, this));
			this.render();
		},

		addCourse: function (ev) {
			app.courses.form.bind(new models.courseModel());
			coursePages.changePage('editCourse');
		},

		getModel: function (ev) {
			ev.preventDefault();
			var lnk = $(ev.currentTarget);
			var id = lnk.data("id");
			var selected = this.allCollection.get(id);
			return selected;
		},

		deleteCourse: function(ev) {
			var selected = this.getModel(ev);
			log(selected, this.collection);
			selected.removeFromDB();
		},

		edit: function (ev) {
			var selected = this.getModel(ev);
			app.courses.form.bind(selected);
			coursePages.changePage('editCourse');
		},

		render: function () {
			var html = Mustache.render(this.template, {
				courses: this.collection.toJSON()
			});
			this.$list.html(html);
		},
		initialize: function() {
			this.$list = this.$(".list");
			this.allCollection = this.collection;
			this.viewAll();
		}
	});

	var courseFormView = Backbone.View.extend({
		template: $("#course-form-template").html(),

		events: {
			'submit form': 'formSubmit',
			'click .cancel': 'cancel',
			'click .js-remove-hole': 'removeHole'
		},

		removeHole: function (ev) {
			ev.preventDefault();
			var row = $(ev.currentTarget).closest('tr');
			var holeNum = row.index();
			var holes = this.model.get('holes');
			holes.splice(holeNum, 1);
			this.model.set('holes', holes);
			row.remove();
			// row.slideUp(function() { row.remove(); });
		},

		createCourse: function (c) {
			// try to keep the course location collection synced to the course collection
			this.collection.once('add', function (m) {
				var locationId = m.get('state') + '/' + m.get('county');
				var courseByLocation = new models.fbCourseByLocationCollection(m.get('state'), m.get('county'));
				courseByLocation.push(m.toJSON());
			});
			this.collection.create(c);
		},

		formSubmit: function (ev) {
			var form = $(ev.currentTarget);
			var data = form.serializeObject();
			var holes = this.$(".hole-list tbody tr").map(function (ix, r) {
				return {
					sort: parseInt($(r).data('sort'), 10),
					par: parseInt($(r).find('.js-par').val(), 10),
					distance: parseInt($(r).find('.js-distance').val(), 10)
				}
			}).toArray();

			data.holes = holes;
			this.model.set(data);

			if (this.model.isNew()) {
				this.createCourse(this.model.toJSON());
			}
			else {
				this.model.updateLocationModel();
				this.model.save();
			}
			this.reset();
			coursePages.changePage('courselist');
			return false;
		},

		cancel: function( ){
			coursePages.changePage('courselist');
		},

		reset: function() {
			this.model = new models.courseModel();
			this.render();
		},

		setLocationInformation: function (loc) {
			this.model.set('zip', loc.zip);
			this.model.set('state', loc.state);
			this.model.set('county', loc.county);
		},

		bind: function (model) {
			var self = this;
			self.model = model;
			if (self.model.isNew()) {
				app.location.getLocation().done(function (loc) {
					self.setLocationInformation(loc);
				});

				var holes = [];
				_.each(_.range(1, 19), function (i) {
					holes.push({
						sort: i,
						par: 4,
						distance: 100
					});
				});
				this.model.set('holes', holes);
			}

			this.render(model.toJSON());
		},

		render: function (modelJson) {
			var html = Mustache.render(this.template, modelJson);
			this.$el.html(html);
		},
		initialize: function () {
			this.reset();
		}
	});

	var coursePages;
	var coll = new models.fbCourseCollection(); 
	app.courses = {};
	app.courses.init = function () { 
		coursePages = new app.pageChanger({
			el: $("#course-pages")
		});
		app.courses.list = new courseListView({
			el: $("#course-list"),
			collection: coll
		});
		app.courses.form = new courseFormView({
			el: $("#course-form"),
			collection: coll
		});

		$(".js-backtolist").on('click', function (ev) {
			ev.preventDefault();
			coursePages.changePage("courselist");
		});
	};
})(app, app.models);