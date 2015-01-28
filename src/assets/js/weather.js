(function () {
	if (!$("header").hasClass("authenticated")){
		$(".weather-link").addClass("hidden");
	}

	var wundergroundApiKey = "c6b9d3f094b7d82b";
	var hoursToDisplay = 12;
	var refreshInterval = 1000 * 60 * 5; // 300000 milliseconds / 5 minutes
	var timeoutInterval = 1000 * 60 * 0.5; // 30000  milliseconds / 30 seconds
	var chart;

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
				getHourlyForecastJSON(zip_code);
			}
		});
		console.log("Weather updated\n");
	}

	function getLocationZip(){
		app.location.getLocation().done(function (loc) {
			setRefreshInterval(loc.zip);
		}).fail(function () {
			swal({
				title: "Oh noes!",
				text: "It looks like we are aren't able to find you right now.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Try Again",
				cancelButtonText: "Back to Home",
				closeOnConfirm: false,
				closeOnCancel: false
			},
			function(isConfirm){
				if (isConfirm) {
					getLocationZip();
					window.setTimeout(showManualZipEntryPopup(), timeoutInterval);
				}
				else {
					window.location.href = '/';
				}
			});
		});
	}

	function setRefreshInterval(zc){
		$('.loading').toggleClass('hidden');
		$('#weather').toggleClass('hidden');
		getWeather(zc); // Get weather now, then set interval
		window.setInterval(function (){
			getWeather(zc)
		}, refreshInterval);
		console.log("Refresh interval set to " + (refreshInterval / 1000 / 60) + " minutes");
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
			return currObs.wind_string.substring(0, i) + '<br />(' + currObs.wind_string.substring(i) + ')';
		});
	}

	function drawChart(dataSet) {
		if (!chart) {
			var canvas = document.getElementById("hourly-forecast-chart");
			var ctx = canvas.getContext("2d");
			chart = new Chart(ctx);
		}
		var hrChart = chart.Line(createChartData(dataSet), {
			bezierCurve: true
		});
	}

	function createChartData(dataSet){
		var fDataSet = [];
		var labelSet = [];
		var date = new Date();
		var hour = date.getHours();
		for (i=0; i<hoursToDisplay; i++){
			fDataSet[i] = dataSet[i].temp.english;
		}
		for (j=0; j<hoursToDisplay; j++){
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
		            pointColor: "rgba(200,200,200,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: fDataSet
		        }
		    ]
		};
		return data;
	}

	function getHourlyForecastJSON(zc){
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
				for (i=0; i<hoursToDisplay; i++){
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

	function showManualZipEntryPopup(){
		swal({
			html: true,
			title: "Unable to find you",
			text: "We can't find you right now.<br /><div id='js-fail-enter-zip'>Enter zip code:&nbsp;<input type='text' id='js-fail-zip-input' class='swal-input' /></div>",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#DD6B55',
			confirmButtonText: 'Submit',
			cancelButtonText: 'Back to Home',
			closeOnCancel: false,
			closeOnConfirm: false
		},
		function(isConfirm){
			if (isConfirm){
				setRefreshInterval(function(){
					return document.getElementById('js-fail-zip-input').value;
				});
			}
			else{
				window.location.href = '/';
			}
		});
	}

	app.weather = {};
	app.weather.init = function(){
		try{
			getLocationZip();
		}
		catch(err){
			showManualZipEntryPopup();
		}
	};
})();