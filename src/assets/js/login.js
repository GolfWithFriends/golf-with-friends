//https://auth.firebase.com
//https://auth.firebase.com/v2/torid-inferno-1191/auth/<social>/callback
//http://jsfiddle.net/firebase/a221m6pb/embedded/result,js/
(function (jQuery, Firebase, Path) {
    "use strict";
    
    // Handle third party login providers
    // returns a promise
	
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
	
	
    function thirdPartyLogin(provider) {
        var deferred = $.Deferred();

        app.fb.authWithOAuthPopup(provider, function (err, user) {
            if (err) {
                deferred.reject(err);
            }

            if (user) {
				checkDisplayName(user);
                app.usersDb.child(user.uid).set(user);
                deferred.resolve(user);
				if(window.location.href.indexOf("games") < 0)
					window.location.href = "/games.html";
            }
        });

        return deferred.promise();
    };
	
	function checkDisplayName(authData) {
		var provider = authData.provider;
		var id = authData.uid;
		
		if(!authData[provider].hasOwnProperty('displayName') || authData[provider].displayName == "") {
			var displayName = setDisplayName();
			authData[provider].displayName = displayName;
		}
	};
    
	
    function showAlert(opts) {
        //var title = opts.title;
        //var detail = opts.detail;
        //var className = 'alert ' + opts.className;

        //alertBox.removeClass().addClass(className);
        //alertBox.children('#alert-title').text(title);
        //alertBox.children('#alert-detail').text(detail);
    };
    
    //Click events
    $('.bt-logout').on('click', function (e) { 
        e.preventDefault();
        app.fb.unauth();
		window.location.reload();
    });
    
    $('.bt-social').on('click', function (e) {

        var $currentButton = $(this);
        var provider = $currentButton.data('provider');
        var socialLoginPromise;
        e.preventDefault();

        socialLoginPromise = thirdPartyLogin(provider);
        handleAuthResponse(socialLoginPromise, 'profile');

    });
	

})(window.jQuery, window.Firebase, window.Path);