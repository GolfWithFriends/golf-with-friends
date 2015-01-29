(function() {
    "use strict";

    app.viewstate.on('change:user', function() {
        var user = app.viewstate.get('user');
        $("header").addClass("authenticated");
        $("#sidebar-username").html(user.displayName);
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
            if (window.location.pathname.indexOf('app') >= 0 && $.isEmptyObject(app.viewstate.attributes.user)){
                if (window.location.pathname.indexOf('app/index') < 0)
                window.location.href = '/app/index.html';
            }
        }
    });

    var body = $('body');
    $('.nav-expander').on('click', function (ev) {
        ev.preventDefault();
        body.toggleClass('sidebar-opened');
    });
	
	$('#signin-link').on('click', function(ev) {
        ev.preventDefault();
        body.toggleClass('sidebar-opened');
		$('#sign-in').show();
    });
})();