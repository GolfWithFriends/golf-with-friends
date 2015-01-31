---
title: 'My Games'
showLoading: true
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
<button class="js-add-game gwf-btn">Add a Game</button>
</br>

<ul class="game-list">
	{{#games}}
	<li data-gameid="{{id}}">
		<div class="game-details">
			<span class="date">{{date}}</span>
			<span class="course">{{course.name}}</span>
		</div>
		<div class="button-wrap">
			<button class="gwf-btn join-link" data-link="http://golf-with-friends.divshot.io/join.html?game={{id}}">
				Join Link
			</button>
		</div>
	</li>
	{{/games}}
</ul>
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
	<button class="gwf-btn" type="submit">Start this Game</button>
	<button href="#" class="gwf-btn cancel">cancel</button>
</div>
</script>

{% endblock %}

{% block scripts %}
<script>
app.games.init();
</script>
{% endblock %}