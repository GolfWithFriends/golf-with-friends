---
title: 'Courses'
---

{% extends 'src/layouts/base.swig' %}
{% block content %}

<div class="page-collection" id="course-pages">
	<div class="page active" data-pagename="courselist">
		<div class="grid" id="course-list">
			<div class="action-list">
				<a class="js-view-near" href="#">View Courses Near Me</a>
				<a class="js-view-all" href="#">View All Courses</a>
			</div>
			<div class="list">

			</div>
		</div>
	</div>
	<div class="page" data-pagename="editCourse">
		<a href="#" class="js-backtolist"><i class="fa fa-angle-left"></i>Back to List</a>
		<h3>You're on the edit page</h3>
		<div id="course-form">

		</div>
	</div>
</div>


<script type="text/template" id="course-list-template">
	<table>
	<thead><tr><th>Name</th><th>Holes</th><th></th></tr></thead>
	<tbody>
	{{^courses}}
		<tr><td colspan="#">There are no courses, add one!</td</tr>
	{{/courses}}
	{{#courses}}
	<tr>
		<td>{{name}}</td>
		<td>{{^holes}}0{{/holes}}{{holes.length}}</td>
		<td>
			<a href="#" class="edit fa fa-edit" data-id="{{id}}"></a>
			<a href="#" class="delete fa fa-remove" data-id="{{id}}"></a>
		</td>
	{{/courses}}
	<tr>
		<td colspan="3"><button class="js-add-course">Add a Course</button></td>
	</tr>
	</tbody>
	</table>
</script>

<script type="text/template" id="course-form-template">
<form>
	<div class="input-wrap">
		<input type="text" name="name" value="{{name}}" placeholder="Course name" />
		<span class="input-deco"></span>
	</div>
	<br /><br />
	<table class="hole-list">
		<thead><tr><th>Hole</th><th>Par</th><th>Distance</th><th></th></tr></thead>
		<tbody>
		{{#holes}}
		<tr data-sort="{{sort}}">
			<td>Hole {{sort}}</td>
			<td>
				<div class="input-wrap iw100">
					<input type="text" class="js-par" placeholder="par" value="{{par}}" />
					<span class="input-deco"></span>
				</div>
			</td>
			<td>
				<div class="input-wrap iw100">
					<input type="text" class="js-distance" placeholder="distance" value="{{distance}}" />
					<span class="input-deco"></span>
				</div>
			</td>
			<td><a href="#" class="js-remove-hole"><i class="fa fa-remove"></i></a></td>
		</tr>
		{{/holes}}
		</tbody>
	</table>
	<div>
		<button type="submit">Save it</button>
		<a href="#" class="cancel">Cancel
	</div>
</form>
</script>

{% endblock %}

{% block scripts %}
<script>
app.courses.init();
</script>
{% endblock %}
