<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main" />
		<title>Import results</title>
	</head>
	<body>
		<h1>Import results</h1>
		<h2># songs</b>: ${importedSongs.size}</h2>
		<ul>
			<g:each in="${importedSongs}" var="song">
				<li>
					${song.name} by ${song.author} 
				</li>
			</g:each>
		</ul>
		<h2># songbooks</b>: ${importedSongbooks.size}</h2>
		<ul>
			<g:each in="${importedSongbooks}" var="songbook">
				<li>
					${songbook.name} by ${songbook.author} 
				</li>
			</g:each>
		</ul>
	</body>
</html>
