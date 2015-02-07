(function (app) {

	function getScore (speech, par) {
		var score;
		switch (speech) {
			case "birdie":
			case "thirty":
			case "30":
			case 30:
				score = par - 1;
				break;
			case "par":
			case "car":
			case "bar":
			case "far":
				score = par;
				break;
			case "bogey":
				score = par + 1;
				break;
			case "one":
			case "1":
				score = 1;
				break;
			case "to":
			case "too":
			case "two":
				score = 2;
				break;
			case "tree":
			case "three":
			case "free":
				score = 3;
			default:
				score = v;
				break;
		}

		return score;
	}

	app.speech2score = {};
	app.speech2score.getScore = getScore;
})(app);