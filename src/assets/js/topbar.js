(function() {
    "use strict";

    app.viewstate.on('change:user', function() {
        var user = app.viewstate.get('user');
        $("body").addClass("authenticated");
        $("#sidebar-username").html(user.displayName);
    });
    
    app.fb.onAuth(function globalOnAuth(authData) {
        if (authData) {
			var id = authData.uid;

			//checks the current display name, sets user on db sync
            var user = new app.models.fbUserById(id);
            user.on('sync', function() {
                app.viewstate.set('user', user);
            });
            
            //TODO Check Displayname
            //if(!user.displayName) {
            //}
            
        } else {
            if ($.isEmptyObject(app.viewstate.attributes) && window.location.pathname != '/app/'){
                window.location.href = '/app/';
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