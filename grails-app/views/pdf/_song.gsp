<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<link rel="stylesheet" href="${resource(dir:'css', file:'song.css')}" type="text/css" media="all" />
		<style media="all">
			@page { size:210mm 297mm; margin:10mm }
			html, body { font-family:sans-serif; font-size:14px; margin:0; padding:0 }
			h1 { padding-bottom:0.2em; border-bottom:1px solid #000 }
		</style>
	</head>
	<body>
		<song:render>${song.text}</song:render>
	</body>
</html>
