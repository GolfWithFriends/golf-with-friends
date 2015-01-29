<!DOCTYPE html>	
<html lang ="en">
	<head>
		<meta charset ="UTF-8" >
		<title>Golf with Friends :: A real time scorecard</title>
		<meta name="viewport" content="initial-scale=1">
		<link href='//fonts.googleapis.com/css?family=Roboto+Condensed|Open+Sans:400,300,600' rel='stylesheet' type='text/css' />
		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
		<link rel="stylesheet" href="/css/all.min.css" type="text/css" />
		<link rel="icon" href="favicon.ico" />
	</head>
	<body class="marketing">
		{% block content %}{% endblock %}

		{% block scripts %}{% endblock %}
		{% if production %}
		<!-- Google Analytics -->
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', 'UA-59004744-1', 'auto');ga('send', 'pageview');
		</script>
		{% else %}
			<script>console.log('%c ===== DEVELOPMENT MODE ===== ', 'background: #222; color: #bada55');</script>
		{% endif %}
	</body>
</html>