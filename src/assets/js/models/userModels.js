(function (models) {

    models.fbUserById = function (id) {
        return new (Backbone.Firebase.Model.extend({

            url: app.fbRoot + 'users/' + id,

            addGame: function (gId) {
            	var games = this.get('games');
            	if (!games) {
            		games = [];
            	}
            	games.push(gId);
            	this.set('games', _.uniq(games));
            },

            getDisplayData: function () {
            	return this.get(this.get('provider'));
            }
        }))();
    };
		
})(app.models);