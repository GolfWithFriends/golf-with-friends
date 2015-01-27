(function () {
	if (!$("header").hasClass("authenticated")){
		$("header .weather").addClass("hidden");
	}

	var wundergroundApiKey = "c6b9d3f094b7d82b";

	function getWeather(zip_code){
		$.ajax({
			"async" : true,
			"url" : "http://api.wunderground.com/api/" + wundergroundApiKey + "/conditions/q/" + zip_code + ".json?callback=?",
			"dataType" : "jsonp",
			"method" : "GET",
			"error": function (jqXHR, textStatus, errorThrown) {
				console.log('ERROR! --> ' + textStatus + ': ' + errorThrown + ' <-- ERROR!');
			},
			"success": function (data, textStatus, jqXHR) {
				if (data.Error || data.Response) {
					exists = 0;
				}
				var currObs = jqXHR.responseJSON.current_observation;
				turnArrow(currObs.wind_degrees);
				updateView(currObs);
				get8HourForecastJSON(zip_code);
			}
		});
		console.log("Weather updated\n");
	}

	function getLocationZip(){
		app.location.getLocation().done(function (loc) {
			setRefreshInterval(app.location.cache.zip);
		}).fail(function () {
			console.log("We were unable to get your location. Sorry");
		});
	}

	function setRefreshInterval(zc){
		$('.loading').toggleClass('hidden');
		$('#weather').toggleClass('hidden');
		getWeather(zc); // Get weather now, then set interval
		window.setInterval(function (){
			getWeather(zc)
		}, 300000);
		console.log("Refresh interval set to " + (300000 / 1000 / 60) + " minutes");
	}

	function updateView(currObs){
		$('td.deets .station').html(currObs.observation_location.full);
		$('td.deets .elev').html(currObs.observation_location.elevation);
		$('td.deets .long').html(currObs.observation_location.longitude + '°');
		$('td.deets .latt').html(currObs.observation_location.latitude + '°');
		$('td.deets .last-updated').html(currObs.observation_time);
		$('td.temp').html(currObs.temp_f + " °F<br />(Feels like " + currObs.feelslike_f + " °F)");
		$('td .wind-string').html(function () {
			var i = currObs.wind_string.indexOf('Gust');
			return currObs.wind_string.substring(0, i) + '<br />' + currObs.wind_string.substring(i);
		});
	}

	function drawChart(dataSet){
		var ctx = document.querySelector("#eight-hr-forecast-chart").getContext("2d");
		var hrChart = new Chart(ctx).Line(createChartData(dataSet), {
			bezierCurve: true
		});
	}

	function createChartData(dataSet){
		var fDataSet = [];
		var labelSet = [];
		var date = new Date();
		var hour = date.getHours();
		for (i=0; i<8; i++){
			fDataSet[i] = dataSet[i].temp.english;
		}
		for (j=0; j<8; j++){
			labelSet[j] = (hour + (j + 1));
			if (labelSet[j] > 23){
				labelSet[j] = labelSet[j] - 24;
			}
			labelSet[j] = labelSet[j] + ':00';
			if (labelSet[j] == '0:00'){
				labelSet[j] = '00:00';
			}
		}
		var data = {
		    labels: labelSet,
		    datasets: [
		        {
		            label: "Hourly Forecast",
		            fillColor: "rgba(220,220,220,0.2)",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "rgba(220,220,220,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: fDataSet
		        }
		    ]
		};
		return data;
	}

	function get8HourForecastJSON(zc){
		var JSON = $.ajax({
			"async" : true,
			"url" : "http://api.wunderground.com/api/" + wundergroundApiKey + "/hourly/q/" + zc + ".json?callback=?",
			"dataType" : "jsonp",
			"method" : "GET",
			"error": function (jqXHR, textStatus, errorThrown) {
				console.log('ERROR! --> ' + textStatus + ': ' + errorThrown + ' <-- ERROR!');
			},
			"success": function (data, textStatus, jqXHR) {
				if (data.Error || data.Response) {
					exists = 0;
				}
				var currHourly = jqXHR.responseJSON.hourly_forecast;
				var curr = [];
				for (i=0; i<8; i++){
					curr[i] = currHourly[i];
				}
				drawChart(curr);
			}
		});
	}

	function turnArrow(windDeg){
		$(".wind-arrow").css("-webkit-transform", "rotate(" + windDeg + "deg)");
		$(".wind-arrow").css("-moz-transform", "rotate(" + windDeg + "deg)");
		$(".wind-arrow").css("transform", "rotate(" + windDeg + "deg)");
	}

	app.weather = {};
	app.weather.init = function () {
		getLocationZip();
	};
})();