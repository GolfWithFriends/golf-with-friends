(function (models) {

    models.fbUserById = function (id) {
        return new (Backbone.Firebase.Model.extend({
            url: app.fbRoot + 'users/' + id 
        }))();
    };
		
})(app.models);