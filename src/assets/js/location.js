(function () {
	var resultBox;
	function requestGoogle (lat, lng, deferred) {
		var key = "key=AIzaSyAU0CWsHzWGyXSnFK-zkZVtpqXFpcfrDlM";
		var url = "https://maps.googleapis.com/maps/api/geocode/json?" + key;
		$.get(url + '&result_type=postal_code|street_address|administrative_area_level_2&latlng=' + lat + ',' + lng).done(function (resp) {
			// var countyComponent = resp.results[4].address_components;
			// var county = countyComponent[0].short_name.replace(/ /g, '');
			// var state = countyComponent[1].short_name;
			var zipComponents = resp.results[1].address_components;
			var countyComponents = resp.results[2].address_components;
			var zip = zipComponents[0].short_name;
			var city = zipComponents[1].short_name.replace(/ /g, '_');
			var state = zipComponents[2].short_name;
			var county = countyComponents[0].short_name.replace(/ /g, '_');

			app.location.cache = {
				zip: zip,
				city: city,
				state: state,
				county: county
			};
			deferred.resolve(app.location.cache);

			if(resultBox) {
				resultBox.html(JSON.stringify(resp.results));
			}
		});
	}

	function positionSuccess (data, deferred) {
		requestGoogle(data.coords.latitude, data.coords.longitude, deferred);
	}

	function positionError (def) {
		if (resultBox) {
			resultBox.html("There was an error getting your location");
		}
		def.reject();
	}

	function requestLocation (deferred) {
		navigator.geolocation.getCurrentPosition(function (data) {
			positionSuccess(data, deferred)
		}, function () {
			positionError(deferred);
		});
	}
	app.location = {};
	app.location.cache = null;
	app.location.init = function () {
		resultBox = $(".location-result");
		$("#get-my-location").on("click", function (ev) {
			resultBox.html("Retrieving...");
			app.location.getLocation();
		});
	};
	app.location.getLocation = function () {
		var def = $.Deferred();
		setTimeout(function() {
			if (app.location.cache) {
				def.resolve(app.location.cache);
			}
			else {
				requestLocation(def);
			}
		}, 0);
		return def.promise();
	};
})();
