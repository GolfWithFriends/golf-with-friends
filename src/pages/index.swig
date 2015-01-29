---
title: 'Home Pagasdfe'
---

{% extends 'src/layouts/wwwBase.swig' %}
{% block content %}

<h1>Welcome to the marketing side</h1>

<a href="/app/">Go to the app</a>

<p>
{%=production%}
</p>

{% endblock %}


{% block scripts %}
{% endblock %}
