---
title: 'Home Page'
---

{% extends 'src/layouts/base.swig' %}
{% block content %}

<div id="intro">
<h1>Welcome to Golf With Friends</h1>
<p>A static web application to keep score of your golf games, disc or regular, with your friends!</p>

<p id="get-started" class="hidden"><strong>To get started - sign in!<i class="fa fa-arrow-right"></i></strong></p>

<ul class="user">
	<li class="sign-in"><a href="#" id="signin-link">Sign in</a></li>
</ul>
</div>

{% endblock %}

{% block scripts %}
<script>
	if ($('header').hasClass('authenticated')){
		$('ul.user .sign-in').toggleClass('hidden');
	}
</script>
{% endblock %}


