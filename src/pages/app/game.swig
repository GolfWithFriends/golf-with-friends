---
title: 'Game'
---

{% extends 'src/layouts/base.swig' %}
{% block content %}

<div class="scorecard-wrap">
	<table class="scorecard">
	</table>
</div>


<script type="text/template" id="scorecard-template">
	<tr class="hole-row">
		<th>Hole</th>
		{{#course}}
			{{#holes}}
				<th>{{sort}}</th>
			{{/holes}}
		{{/course}}
		<th></th>
	</tr>
	<tr class="par-row">
		<th>Par</th>
		{{#course}}
			{{#holes}}
				<th>{{par}}</th>
			{{/holes}}
		{{/course}}
		<th></th>
	</tr>
	{{#players}}
		<tr data-id="{{playerId}}" class="player-row">
			<td>{{name}}</td>
			{{#scores}}
				<td class="hole-score">{{.}}</td>
			{{/scores}}
			<td class="score-total">{{total}}</td>
		</tr>
	{{/players}}
</script>

{% endblock %}

{% block scripts %}
<script>
app.scorecard.init();
</script>
{% endblock %}