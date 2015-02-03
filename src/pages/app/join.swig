---
title: 'Join'
showLoading: true
---

{% extends 'src/layouts/base.swig' %}
{% block content %}

<div id="join-wrap">

</div>

	
<script id="join-template" type="text/template">
	<h2>Are you sure you want to join {{date}} @ {{course.name}}?</h2>
	<button class="js-join" type="submit">Yes, put me in the game</button>
</script>
<script id="join-nouser-template" type="text/template">
	<h2>For now, you have to be authenticated to join a game. Sorry.</h2>
	<p><a href="login.html">Sign in</a></p>
</script>
{% endblock %}

{% block scripts %}
<script>
app.join.init();
</script>
{% endblock %}