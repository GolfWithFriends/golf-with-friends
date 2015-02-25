(function (app, auth, models) {
	"use strict";

    var body = $('body');
	if (auth.user) {
		auth.user.on('sync', function () {
			body.addClass("authenticated");
			$("#sidebar-username").html(auth.user.getDisplayData().displayName);
		});
	}

	var navExp = $('.nav-expander');
	app.viewstate.on('change:notifications', function (vs, n) {
		var notif = navExp.siblings('.notif');
		if (!notif.length) {
			notif = $("<div class='notif' />").insertBefore(navExp);
		}

		notif.html(n.length.toString());
		notif.toggle(n.length > 0);
	});

    navExp.on('click', function (ev) {
        ev.preventDefault();
        body.toggleClass('sidebar-opened');
    });
	
	$('#signin-link').on('click', function(ev) {
        ev.preventDefault();
        body.toggleClass('sidebar-opened');
		$('#sign-in').show();
    });

    // Click events
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
        	// log("done", u);
        	if (window.location.href.indexOf("games") < 0) {
				window.location.href = "/app/games.html";
			}
        });
        loginPromise.fail(function () {
    		console.error("failed login");
        });
    });

    if (auth.user) {
    	var invite = new models.invite({id: auth.user.id});
	    invite.save();
		invite.on('sync', function () {
			if ((invite.get('items') || []).length === 0) {
				invite.add('test-invite');
				invite.save();
			}

			app.viewstate.set('notifications', invite.get('items'));
		});
    }

})(app, app.auth, app.models);