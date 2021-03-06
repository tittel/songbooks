<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<link rel="stylesheet" href="${resource(dir:'css', file:'song.css')}" type="text/css" media="all" />
		<style media="all">
			@page { <song:renderPageSize>${songbook.format}</song:renderPageSize> }
			@page:left { <song:renderPageLeftMargin /> }
			@page:right { <song:renderPageRightMargin /> }
			@page songs:left { @bottom-right { content:counter(page) } }
			@page songs:right { @bottom-left { content:counter(page) } }
			html, body { font-family:sans-serif; font-size:13px; margin:0; padding:0 }
			h1 { padding-bottom:0.2em; border-bottom:1px solid #888 }
			a { text-decoration:none; color:inherit }
			ul { list-style-type:none; margin:0; padding:0 }
			
			.front-page { page-break-after:always; display:table; <song:renderFullWidthHeight>${songbook.format}</song:renderFullWidthHeight>; table-layout:fixed }
			.front-page > div { color:#888; font-size:200%; display:table-cell; vertical-align:middle; overflow:hidden }
			.front-page > div > div { word-wrap:break-word; word-break:break-all; white-space:pre-wrap }
			.front-page .name { color:#04C; font-variant:small-caps; font-size:2em; border-bottom:3px solid #888 }
			.front-page .author { text-align:right }
			.front-page .date { text-align:right }
			
			.toc { font-size:0.8em; page-break-before:right }
			.index { font-size:0.8em; page-break-before:left }
			.index h2 { font-size:1.2em; margin-bottom:0 }
			.index a { padding-left:1em }
			.toc a:after, .index a:after { content:leader('.') target-counter(attr(href), page) }
			/*.toc, .index, .songs { -moz-column-count:2; -webkit-column-count:2; column-count:2 }*/
			
			.songs { page:songs; page-break-before:left }
			.songs h1 { border-color:#04C }
			.songview { margin-bottom:1em }
			.songview .chord-definition { width:auto; height:auto; opacity:inherit }
		</style>
	</head>
	<body>
		<%-- create front page --%>
		<div class="front-page">
			<div>
				<div class="name">${songbook.name}</div>
				<div class="author">${songbook.author}</div>
				<div class="date"><g:formatDate format="dd. MMMM yyyy" date="${songbook.lastUpdated}"/></div>
			</div>
		</div>
		<%-- sort songs by name --%>
		<g:set var="songsByName" value="${songbook.songs.sort{a,b -> a.name.toLowerCase().replace('ä', 'a').replace('ü', 'u').replace('ö', 'o') < b.name.toLowerCase().replace('ä', 'a').replace('ü', 'u').replace('ö', 'o') ? -1 : 1}}" />
		<%-- create index by song name --%>
		<div class="toc">
			<h1>Contents</h1>
			<ul>
				<g:each in="${songsByName}" var="song">
				   <li><a href="#${song.id}">${song.name}</a></li>
				</g:each>
			</ul>
		</div>
		<%-- create content with songs --%>
		<div class="songs">
			<g:each in="${songsByName}" var="song">
				<song:render songId="${song.id}">${song.text}</song:render>
			</g:each>
		</div>
		<%-- create index by author --%>
		<div class="index">
			<h1>Index</h1>
			<g:set var="songsByAuthorMap" value="${songbook.songs.groupBy { it.author }}" /> 
			<g:each in="${songsByAuthorMap.keySet().sort{a,b -> a.toLowerCase().replace('ä', 'a').replace('ü', 'u').replace('ö', 'o') < b.toLowerCase().replace('ä', 'a').replace('ü', 'u').replace('ö', 'o') ? -1 : 1}}" var="author">
				<div class="sticky">
					<h2>${author}</h2>
					<ul>
						<g:each in="${songsByAuthorMap[author].sort{a,b -> a.name.toLowerCase().replace('ä', 'a').replace('ü', 'u').replace('ö', 'o') < b.name.toLowerCase().replace('ä', 'a').replace('ü', 'u').replace('ö', 'o') ? -1 : 1}}" var="song">
							<li><a href="#${song.id}">${song.name}</a></li>
						</g:each>
					</ul>
				</div>
			</g:each>
		</div>
		<g:if test="${print}">
			<script type="text/javascript">
				window.print();
			</script>
		</g:if>
	</body>
</html>
