(function () {
	var myFirebaseRef = new Firebase("https://torid-inferno-1191.firebaseio.com/");

	app.fb = myFirebaseRef;
	app.usersDb = myFirebaseRef.child('users');
	app.gamesDb = myFirebaseRef.child('games');
})();