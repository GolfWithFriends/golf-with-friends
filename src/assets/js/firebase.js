(function () {
	var myFirebaseRef = new Firebase("https://glaring-torch-1858.firebaseio.com/");

	app.fb = myFirebaseRef;
	app.usersDb = myFirebaseRef.child('users');
	app.gamesDb = myFirebaseRef.child('games');
})();