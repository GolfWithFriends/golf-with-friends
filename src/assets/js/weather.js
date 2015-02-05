(function (models) {
	if ($.isEmptyObject(app.viewstate.attributes)){
		$(".weather-link").addClass("hidden");
	}

	var wundergroundApiKey = "c6b9d3f094b7d82b";
	var wundergroundHourlyApiKey = "776e797e964493d4";
	var hoursToDisplay = 10;
	var refreshInterval = 1000 * 60 * 5; // 300000 milliseconds / 5 minutes
	var timeoutInterval = 1000 * 60 * 0.5; // 30000  milliseconds / 30 seconds
	var timeout;
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
			window.clearTimeout(timeout);
			setRefreshInterval(loc.zip);
		}).fail(function () {
			swal({
				title: "Oh noes!",
				text: "It looks like we are aren't able to find you right now.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: '#e67478',
				confirmButtonText: "Enter Zip Code",
				cancelButtonText: "Try Again",
				closeOnConfirm: true,
				closeOnCancel: true
			},
			function(isConfirm){
				if (isConfirm) {
					var custZip = prompt("Please enter your zip code", "");
					setRefreshInterval(custZip);
				}
				else {
					timeout = window.setTimeout(showManualZipEntryPopup, timeoutInterval);
					getLocationZip();
				}
			});
		});
	}

	function setRefreshInterval(zc){
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
		$(".wind-mph .number").html(currObs.wind_mph);
		$('td .wind-string').html(function () {
			var i = currObs.wind_string.indexOf('Gust');
			if (i != -1){
				return currObs.wind_string.substring(0, i) + '<br />(' + currObs.wind_string.substring(i) + ')';
			}
			else{
				return currObs.wind_string;
			}
		});
		app.loader.hide();
	}

	function drawChart(dataSet) {
		if (!chart) {
			var canvas = document.getElementById("hourly-forecast-chart");
			var ctx = canvas.getContext("2d");
			chart = new Chart(ctx);
		}
		var hrChart = chart.Line(createChartData(dataSet), {
			bezierCurve: true,
			tooltipTemplate: "<% if (label){ %><%= label %> : <% } %><%= value + ' °F' %>",
			multiTooltipTemplate: "<%= value + ' °F   ' + datasetLabel %>",
			scaleLabel: "<%= value + ' °F' %>"
		});
	}

	function createChartData(dataSet){
		var fDataSet = [];
		var labelSet = [];
		var flDataSet = [];
		for (i=0; i<hoursToDisplay; i++){
			fDataSet[i] = dataSet[i].temp.english;
			labelSet[i] = dataSet[i].FCTTIME.civil;
			flDataSet[i] = dataSet[i].feelslike.english;
		}
		var data = {
		    labels: labelSet,
		    datasets: [
		    	/*{
		            label: "Feels Like",
					fillColor: "rgba(100,45,100,0.1)",
		            strokeColor: "rgba(100,45,100,0.4)",
		            pointColor: "#ff9b08",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(100,45,100,1)",
		            data: flDataSet
		        }*/
		        {
		            label: "Hourly Forecast",
					fillColor: "rgba(45,100,45,0.1)",
		            strokeColor: "rgba(45,100,45,0.4)",
		            pointColor: "rgba(45,100,45,0.8)", // Color of rgba(45,100,45,0.8) but with no opacity
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(45,100,45,1)",
		            data: fDataSet
		        }
		    ]
		};
		return data;
	}

	function getHourlyForecastJSON(zc){
		var JSON = $.ajax({
			"async" : true,
			"url" : "http://api.wunderground.com/api/" + wundergroundHourlyApiKey + "/hourly/q/" + zc + ".json?callback=?",
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
			text: "We can't find you right now.<br />Enter local zip code to get weather.",
			type: 'error',
			showCancelButton: true,
			confirmButtonColor: '#e67478',
			confirmButtonText: 'Enter Zip Code',
			cancelButtonText: 'Try Again',
			closeOnCancel: true,
			closeOnConfirm: true,
			onOutsideClick: (function(){
				window.location.href = '/app/weather.html'
			})
		},
		function(isConfirm){
			if (isConfirm){
				var custZip = prompt("Please enter your zip code", "");
				setRefreshInterval(custZip);
			}
			else{
				window.location.href = '/app/weather.html';
			}
		});
	}

	app.weather = {};
	app.weather.init = function(){
		try{
			timeout = window.setTimeout(showManualZipEntryPopup, timeoutInterval);
			getLocationZip();
		}
		catch(err){
			console.log('Error getting location: ' + err);
			showManualZipEntryPopup();
		}
	};
})(app.models);
