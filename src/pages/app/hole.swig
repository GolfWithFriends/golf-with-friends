---
title: 'Join'
showLoading: true
---

{% extends 'src/layouts/base.swig' %}
{% block content %}
	<div id="hole-view">

	</div>

	<script type="text/template" id="hole-template">
		<div class="hole-num">
			<span>Hole {{holeDisplay}} of {{totalHoles}}</span>
		</div>
		<div class="clearfix hole-info">
			<div class="hole-par">Par {{hole.par}}</div>
			<div class="hole-distance">Dist {{hole.distance}}</div>
		</div>
		</div>

		<div class="player-score">
			<label>Score</label>
			<div class="input-wrap">
				<input type="text" value="{{score}}" />
			</div>
			<div class="speech-button-wrap">
				<button class="js-listen gwf-btn">Start Listening</button>
				<button class="js-stop-listen gwf-btn gwf-btn-red">Stop Listening</button>
			</div>
		</div>
		<div class="hole-nav">
			{{#hasPrev}}<a class="js-prev-hole" href="?game={{game.id}}&hole={{prevHole}}">Previous</a>{{/hasPrev}}
			{{#hasNext}}<a class="js-next-hole" href="?game={{game.id}}&hole={{nextHole}}">Next</a>{{/hasNext}}
		</div>
	</script>

{% endblock %}

{% block scripts %}
<script>
app.hole.init();
</script>
{% endblock %}