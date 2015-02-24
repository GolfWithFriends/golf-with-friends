(function (app, auth) {
	"use strict";

    var body = $('body');
	if (auth.user) {
		auth.user.on('sync', function () {
			body.addClass("authenticated");
			$("#sidebar-username").html(auth.user.getDisplayData().displayName);
		});
	}

    $('.nav-expander').on('click', function (ev) {
        ev.preventDefault();
        body.toggleClass('sidebar-opened');
    });
	
	$('#signin-link').on('click', function(ev) {
        ev.preventDefault();
        body.toggleClass('sidebar-opened');
		$('#sign-in').show();
    });

        //Click events
    $('.bt-logout').on('click', function (e) { 
        e.preventDefault();
        app.auth.logout();
		window.location.reload();
    });
    
    $('.bt-social').on('click', function (e) {
        e.preventDefault();

        var $currentButton = $(this);
        var provider = $currentButton.data('provider');
        var loginPromise = app.auth.login(provider);

        loginPromise.done(function (u) {
        	log("done", u);
        	if (window.location.href.indexOf("games") < 0) {
				window.location.href = "/app/games.html";
			}
        });
        loginPromise.fail(function () {
    		console.error("failed login");
        });

    });

})(app, app.auth);