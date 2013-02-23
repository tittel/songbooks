<html>
	<head>
		<meta name="layout" content="main" />
		<title>Import songs</title>
	</head>
	<body>
		<h1>Choose file to import</h1>
		<g:uploadForm method="post" name="import-backup-form">
			<label for="replace">Replace current content:</label>
			<input type="checkbox" id="replace" name="replace" /><br>
			<label for="payload">File:</label>
			<input type="file" id="payload" name="payload" />
			<g:submitButton name="submit" value="Import" />
		</g:uploadForm>
	</body>
</html>
