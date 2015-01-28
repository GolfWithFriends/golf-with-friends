(function() {
    "use strict";

    app.viewstate.on('change:user', function() {
        var user = app.viewstate.get('user');
        $("header").addClass("authenticated");
        $("header #username-link").html(user.displayName);
    });
    
    app.fb.onAuth(function globalOnAuth(authData) {
        if (authData) {
			var provider = authData.provider;
			var id = authData.uid;
			
            var userData = authData[provider];
            userData.id = id;
			
			//checks the current display name, sets user on db sync 
			if(!userData.displayName) {
				var user = new app.models.fbUserById(id);

				user.on('sync', function(){				
				    userData = user.toJSON()[provider];
					app.viewstate.set('user', userData).trigger('change:user');
				});
			}

            app.viewstate.set('user', userData);
        } else {
			if(window.location.pathname != "/")
				window.location.href = "/";
        }
    });

    var body = $('body');
    $('#username-link').on('click', function(ev) {
        ev.preventDefault();
        body.toggleClass('sidebar-opened');
    });
	
	$('#signin-link').on('click', function(ev) {
        ev.preventDefault();
        body.toggleClass('sidebar-opened');
		$('#sign-in').show();
    });
})();