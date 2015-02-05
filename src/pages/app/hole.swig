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
			<span>Hole {{holeNum}} of {{totalHoles}}</span>
		</div>
		<div class="clearfix hole-info">
			<div class="hole-par">Par {{hole.par}}</div>
			<div class="hole-distance">Dist {{hole.distance}}</div>
		</div>
		</div>

		<div class="player-score">
			<label>Score</label>
			<div class="input-wrap">
				<input type="text" />
			</div>
			<button class="js-listen gwf-btn">Listen</button>
		</div>
	</script>

{% endblock %}

{% block scripts %}
<script>
app.hole.init();
</script>
{% endblock %}