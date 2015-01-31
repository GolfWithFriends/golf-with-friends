(function (app) {

	var loaderView = new (Backbone.View.extend({

		hide: function() {
			this.$el.fadeOut();
		},

		show: function (msg) {
			this.$title.html(msg || "Loading...");
			this.$el.fadeIn();
		},

		initialize: function() {
			this.$title = this.$("h3");
			if (app.showLoading) {
				this.show();
			}
		}
	}))({
		el: "#loader"
	})

	app.loader = loaderView;

})(app);