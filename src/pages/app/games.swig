---
title: 'My Games'
---

{% extends 'src/layouts/base.swig' %}
{% block content %}

<div class="page-collection" id="game-pages">
	<div class="page" data-pagename="gamelist">
		<div class="grid" id="game-list">
		</div>
	</div>
	<div class="page" data-pagename="gameform">
		<div id="game-form">
			<form>

			</form>
		</div>
	</div>
</div>


<script type="text/template" id="game-list-template">
	<table>
		<thead>
			<tr>
				<th>Games</th>
				<th>Join Link</th>
			</tr>

		</thead>
		<tbody>
	{{#games}}
	
	
	<tr>
		<td>
			<a href="game.html?game={{id}}">{{^course}}{{id}}{{/course}}{{#course}}{{date}} @ {{course.name}}{{/course}}</a>
		</td>
		<td>
			http://ss15-fart-flask.divshot.io/join.html?game={{id}}
		</td>

	</tr>
	{{/games}}
		</tbody>
	</table>
	</br>
	<button class="js-add-game">Add a Game</button>
</script>

<script type="text/template" id="game-form-template">
<div class="control">
	<label>Course</label>
	<select name="courseId">
		<option value="">-- Select a Course --</option>
		{{#courses}}
		<option value="{{id}}">{{name}}</option>
		{{/courses}}
	</select>
	<a href="#" class="js-local" style="display: none;">Only show me courses close to me</a>
	<a href="#" class="js-all">Show me all the courses</a>
</div>
<div>
	<button type="submit">Start this Game</button>
	<button href="#" class="cancel">cancel</button>
</div>
</script>

{% endblock %}

{% block scripts %}
<script>
app.games.init();
</script>
{% endblock %}