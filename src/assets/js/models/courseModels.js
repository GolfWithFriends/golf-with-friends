(function (models) {

	models.fbCourseModel = function (id) {
		return new (Backbone.Firebase.Model.extend({
			url: app.fbRoot + 'courses/' + id
		}))();
	};

	models.fbCourseByLocation = function (state, county, id) {
		return new (Backbone.Firebase.Model.extend({
			url: app.fbRoot + 'coursesByLocation/' + state + '/' + county + '/' + id
		}))();
	};

	models.courseModel = Backbone.Model.extend({

		getLocationModel: function () {
			var locModel = new models.fbCourseByLocation(this.get('state'), this.get('county'), this.get('id'));
			return locModel;
		},

		updateLocationModel: function () {
			var lm = this.getLocationModel();
			lm.set(this.toJSON());
		},

		removeFromDB: function () {
			var locationModel = this.getLocationModel();
			locationModel.destroy();
			this.destroy();
		}

	});

	models.fbCourseCollection = Backbone.Firebase.Collection.extend({
		model: models.courseModel,
		url: app.fbRoot + 'courses'
	});

	models.fbCourseByLocationCollection = function (state, county) {
		return new (Backbone.Firebase.Collection.extend({
			model: models.courseModel,
			url: app.fbRoot + 'coursesByLocation/' + state + '/' + county
		}))();
	};



})(app.models);