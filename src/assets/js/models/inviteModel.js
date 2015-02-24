(function (models) {

	models.invite = Backbone.Firebase.Model.extend({
		urlRoot: app.fbRoot + 'invites/',

		add: function (i) {
			var items = this.get('items') || [];
			items.push(i);
			this.set('items', items);
		}
	})

})(app.models);