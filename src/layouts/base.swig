<!DOCTYPE html>	
<html lang ="en">
	<head>
		<meta charset ="UTF-8" >
		<title>Golf with Friends - {%=title%}</title>
		<meta name="viewport" content="initial-scale=1">
		<link href='//fonts.googleapis.com/css?family=Roboto+Condensed|Open+Sans:400,300,600' rel='stylesheet' type='text/css' />
		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
		<link rel="stylesheet" href="../css/all.min.css" type="text/css" />
		<link rel="icon" href="../favicon.ico" />
	</head>
	<body class="app">
		<div id="body-container">
			{% include 'header.swig' %}
			<div class="page-container">
				{% block content %}{% endblock %}
				{% include 'loader.swig' %}
			</div>
		</div>

		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="js/jquery.min.js"><\/script>')</script>

		<!-- TODO Might be helpful to bundle these together but I don't think it's important right now -->
		<script src="//cdn.firebase.com/js/client/2.1.1/firebase.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache.min.js"></script>
		<script src="//cdn.firebase.com/libs/backbonefire/0.5.1/backbonefire.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/annyang/1.4.0/annyang.js"></script>
		<!-- end vendors -->

		<!-- Load Divshot envrionment variables only if we're on divshot.io -->
		<script>
			if (window.location.href.indexOf('divshot.io') >= 0)
				document.write('<script src="/__/env.js"><\/script>');
		</script>

		<script>
			var app = {};
			app.models = {};
			app.viewstate = new Backbone.Model();
			app.fbRoot = "https://torid-inferno-1191.firebaseio.com/";
			if (window.location.href.indexOf('divshot.io') >= 0)
				app.divshotConfig = window.__env.CONFIG;
			else
				app.divshotConfig = 'development';
		</script>

		<!-- build:js /js/all.min.js -->
		<script type="text/javascript" src="/js/plugins/tocca.js"></script>
		<script type="text/javascript" src="/js/plugins/jquery.cselect.js"></script>
		<script type="text/javascript" src="/js/plugins/sweet-alert.js"></script>

		<script type="text/javascript" src="/js/models/courseModels.js"></script>
		<script type="text/javascript" src="/js/models/gameModels.js"></script>
        <script type="text/javascript" src="/js/models/userModels.js"></script>
        <script type="text/javascript" src="/js/models/inviteModel.js"></script>

		<script type="text/javascript" src="/js/common.js"></script>
		<script type="text/javascript" src="/js/firebase.js"></script>
		<script type="text/javascript" src="/js/auth.js"></script>
		<script type="text/javascript" src="/js/speech2score.js"></script>
		<script type="text/javascript" src="/js/loader.js"></script>
		<script type="text/javascript" src="/js/chart.js"></script>
		<script type="text/javascript" src="/js/courses.js"></script>
		<script type="text/javascript" src="/js/game.js"></script>
		<script type="text/javascript" src="/js/games.js"></script>
		<script type="text/javascript" src="/js/hole.js"></script>
		<script type="text/javascript" src="/js/join.js"></script>
		<script type="text/javascript" src="/js/location.js"></script>
		<script type="text/javascript" src="/js/login.js"></script>
		<script type="text/javascript" src="/js/main.js"></script>
		<script type="text/javascript" src="/js/sidebar.js"></script>
		<script type="text/javascript" src="/js/weather.js"></script>
		<!-- endbuild -->

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
		<script>
			if ((app.divshotConfig === "production") && (window.location.protocol == "http:")) {
				window.location.protocol = "https:";
			}
		</script>
		{% else %}
			<script>console.log('%c ===== DEVELOPMENT MODE ===== ', 'background: #222; color: #bada55');</script>
		{% endif %}
	</body>
</html>