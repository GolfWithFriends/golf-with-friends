---
title: 'Courses'
---

{% extends 'src/layouts/base.swig' %}
{% block content %}

<button id="get-my-location">Get My Location</button>
<div class="location-result">

</div>

{% endblock %}


{% block scripts %}
<script>
app.location.init();
</script>
{% endblock %}