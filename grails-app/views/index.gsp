<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main"/>
		<title>Songbooks</title>
		<script type="text/javascript">var contextPath="${request.contextPath}/"</script>
		<script type="text/javascript" data-main="js/main" src="${resource(dir: 'js/libs/require', file: 'require.js')}"></script>
	</head>
	<body>
		<div id="page">
			<div id="toolbar"></div>
			<div id="content">
				<div class="spinner"><g:message code="spinner.alt" default="Loading&hellip;"/></div>
			</div>
			<div id="songbook-panel" class="collapsible-panel-content"></div>
		</div>
	</body>
</html>
