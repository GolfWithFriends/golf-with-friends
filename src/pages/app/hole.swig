---
title: 'Join'
showLoading: true
---

{% extends 'src/layouts/base.swig' %}
{% block content %}
	<div id="hole-pager" class="hole-pager">

		<div class="hole-nav">
			<button class="js-prev-hole gwf-btn">Prev</button>
			<button class="js-next-hole gwf-btn">Next</button>
		</div>
	</div>

	<script type="text/template" id="hole-view-template">
	<div class="hole-view">
		<div class="hole-view-inner">
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
		</div>
	</div>
	</script>

{% endblock %}

{% block scripts %}
<script>
app.hole.init();
</script>
{% endblock %}