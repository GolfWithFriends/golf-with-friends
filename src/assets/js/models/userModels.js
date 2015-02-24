(function (models) {

    models.fbUser = Backbone.Firebase.Model.extend({
        urlRoot: app.fbRoot + 'users/',
        
        addGame: function (gId) {
            var games = this.get('games');
            if (!games) {
                games = [];
            }
            games.push(gId);
            this.set('games', _.uniq(games));
            this.save();
        },

        getDisplayData: function () {
            return this.get(this.get('provider'));
        }
    });

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
                this.save();
            },

            getDisplayData: function () {
            	return this.get(this.get('provider'));
            }
        }))();
    };
		
})(app.models);