(function (app, models) {
	"use strict";

	function setDisplayName() {
	
		var names = ['Bones', 'Poo', 'Butt', 'Juicy',
					 'Dustin', 'Toe', 'Ethan', 'Connor', 
					 'Sauce', 'Apple', 'Mega', 'Tron', 
					 'Smasher', 'Dick', 'Swallows', 'Wang',
					 'Ben', 'Dover', 'Gobbledygook', 'Lollygag',
					 'Ashley', 'Megan', 'Turtle', 'Ninja',
					 'Jam', 'Light', 'Face', 'Cream'];
		
		return names[Math.floor(Math.random() * names.length)] + " " + names[Math.floor(Math.random() * names.length)];
	};

	function checkDisplayName(authData) {
		var provider = authData.provider;
		var id = authData.uid;
		
		if (!authData[provider].hasOwnProperty('displayName') || authData[provider].displayName == "") {
			var displayName = setDisplayName();
			authData[provider].displayName = displayName;
		}
	};

	function login (provider) {
        var deferred = $.Deferred();

        app.fb.authWithOAuthPopup(provider, function (err, user) {
            if (err) {
                deferred.reject(err);
            }

            if (user) {
				checkDisplayName(user);
				var fbUser = new models.fbUser({id: user.uid});
				fbUser.set(user);
                deferred.resolve(fbUser);
				// if (window.location.href.indexOf("games") < 0) {
				// 	window.location.href = "/app/games.html";
				// }
            }
        });

        return deferred.promise();
	};

	var auth = app.fb.getAuth(),
		fbUser;
	
	if (auth) {
		fbUser = new models.fbUser({id: auth.uid });
	}

	app.auth = {
		logout: app.fb.unauth,
		login: login,
		user: fbUser
	};
})(app, app.models);