<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main" />
		<title>Import results</title>
	</head>
	<body>
		<h1>Import results</h1>
		<p># songs: ${importedSongs.size}</p>
		<ul>
			<g:each in="${importedSongs}" var="song">
				<li>
					${song.name} by ${song.author} 
				</li>
			</g:each>
		</ul>
	</body>
</html>
