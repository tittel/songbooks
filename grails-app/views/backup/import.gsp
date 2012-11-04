<html>
	<head>
		<meta name="layout" content="main" />
		<title>Import songs</title>
	</head>
	<body>
		<h1>Choose file to import</h1>
		<g:uploadForm method="post">
			<label for="payload">File:</label>
			<input type="file" id="payload" name="payload" />
			<g:submitButton name="submit" value="Import" />
		</g:uploadForm>
	</body>
</html>
