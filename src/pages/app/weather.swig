---
title: 'Weather'
showLoading: true
---

{% extends 'src/layouts/base.swig' %}
{% block content %}
<div id="weather-wrap">
	<table id="weather">
		<tr>
			<th colspan="4" class="tableTitle"><h1>Weather</h1></th>
		</tr>
		<tr>
			<td colspan="2" class="deets">
				<p class="station">--</p>
				<small>Elevation: <span class="elev">--</span> | Location: <span class="latt">--</span>,&nbsp;<span class="long">--</span></small>
				<br />
				<small class="last-updated">--</small>
			</td>
			<td rowspan="3" colspan="2" id="ch">
				<div class="crosshair-wrap">
					<img src="//i.imgur.com/bKebHQK.png" class="wind-circle" />
					<img src="//i.imgur.com/KCnJi7S.png" class="wind-arrow" />
					<div class="wind-mph">
						<p class="north-n">N</p>
						<p class="number">--</p>
						<p class="unit">mph</p>
					</div>
				</div>
			</td>
		</tr>
		<tr>
			<td>Temperature</td>
			<td class="temp">--</td>
		</tr>
		<tr>
			<td>Wind</td>
			<td>
				<p class="wind-string">--</p>
			</td>
		</tr>
		<tr>
			<td>Hourly Forecast</td>
			<td colspan="3" class="hourly-fcast">
				<canvas id="hourly-forecast-chart" width="500" height="250"></canvas>
			</td>
		</tr>
		<tr>
			<td id="attribution" colspan="4" class="borderless"><small>Weather provided by Weather Underground</small></td>
		</tr>
	</table>
</div>
{% endblock %}

{% block scripts %}
<script>
	app.loader.show('Finding your location...');
	app.weather.init();
</script>
{% endblock %}