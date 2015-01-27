---
title: 'Weather'
---

{% extends 'src/layouts/base.swig' %}
{% block content %}
<div id="weather-wrap">
	<div class="loading">
		<h1>Finding you...</h1>
		<br />
		<div class='loader1'>
		  <div>
		    <div>
		      <div>
		        <div>
		          <div>
		            <div></div>
		          </div>
		        </div>
		      </div>
		    </div>
		  </div>
		</div> <!-- End loader -->
	</div>
	<table id="weather" class="hidden">
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
					<img src="http://i.imgur.com/jBWIh4z.png" class="wind-crosshair" />
					<img src="http://i.imgur.com/O8s9gss.png" class="wind-arrow" />
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
				<!--<p><span class="wind-speed">-</span> out of the <span class="wind-dir">-</span></p>-->
				<p class="wind-string">--</p>
			</td>
		</tr>
		<tr>
			<td>Hourly Forecast</td>
			<td colspan="3" class="hourly-fcast">
				<canvas id="hourly-forecast-chart" width="500" height="200"></canvas>
			</td>
		</tr>
	</table>
</div>
{% endblock %}

{% block scripts %}
<script>
	app.weather.init();
</script>
{% endblock %}