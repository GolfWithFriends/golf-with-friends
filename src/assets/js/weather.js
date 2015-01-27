(function () {
	if (!$("header").hasClass("authenticated")){
		$("header .weather").addClass("hidden");
	}

	var wundergroundApiKey = "1eae409b3b5579d9";
	var wxLocation = app.location.getLocation(function(loc){
		console.log(loc.zipCode);
	});	
	var zipCode = 65202;

	function getWeather(){
		$.ajax({
			"async" : true,
			"url" : "http://api.wunderground.com/api/" + wundergroundApiKey + "/conditions/q/" + zipCode + ".json?callback=?",
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
				get8HourForecastJSON();
			}
		});
	}

	function updateView(currObs){
		$('td.deets .station').html(currObs.observation_location.full);
		$('td.deets .elev').html(currObs.observation_location.elevation);
		$('td.deets .long').html(currObs.observation_location.longitude + '°');
		$('td.deets .latt').html(currObs.observation_location.latitude + '°');
		$('td.deets .last-updated').html(currObs.observation_time);
		$('td.temp').html(currObs.temp_f + " °F<br />(Feels like " + currObs.feelslike_f + " °F)");
		$('td .wind-speed').html(currObs.wind_mph + " mph");
		$('td .wind-dir').html(currObs.wind_dir);
	}

	function drawChart(dataSet){
		var ctx = document.querySelector("#eight-hr-forecast-chart").getContext("2d");
		var hrChart = new Chart(ctx).Line(createChartData(dataSet), {
			bezierCurve: false
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

	function get8HourForecastJSON(){
		var JSON = $.ajax({
			"async" : true,
			"url" : "http://api.wunderground.com/api/" + wundergroundApiKey + "/hourly/q/" + zipCode + ".json?callback=?",
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
	app.weather.init = getWeather;
})();