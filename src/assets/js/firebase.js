(function () {
	var myFirebaseRef = new Firebase(app.fbRoot);

	app.fb = myFirebaseRef;
	app.usersDb = myFirebaseRef.child('users');
	app.gamesDb = myFirebaseRef.child('games');
})();