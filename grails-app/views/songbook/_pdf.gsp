<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<link rel="stylesheet" href="${resource(dir:'css', file:'song.css')}" type="text/css" media="all" />
		<style media="all">
			/*@page { size:297mm 210mm }*/
			@page { size:148mm 210mm }
			@page:left { margin:10mm 10mm 10mm 20mm }
			@page:right { margin:10mm 20mm 10mm 10mm }
			@page songs:left {
				@bottom-right {
					content:counter(page);
				}
			}
			@page songs:right {
				@bottom-left {
					content:counter(page);
				}
			}
			html, body { font-family:sans-serif; font-size:14px; margin:0; padding:0 }
			h1 { padding-bottom:0.2em; border-bottom:1px solid #000 }
			a { text-decoration:none; color:inherit }
			ul { list-style-type:none; margin:0; padding:0 }
			
			.front-page { font-size:24px; display:table; width:100%; height:180mm; page-break-after:always }
			.front-page > div { display:table-cell; vertical-align:middle}
			.front-page .name { font-size:3em; font-variant:small-caps; border-bottom:1px solid black }
			.front-page .author { text-align:right }
			.front-page .date { text-align:right }
			
			.blank { page-break-after:always; page-break-before:always }
			
			.toc { font-size:0.7em; page-break-before:right }
			.index { font-size:0.7em; page-break-before:left }
			.index h2 { font-size:1.2em; margin-bottom:0 }
			.index a { padding-left:1em }
			.toc a:after, .index a:after { content:leader('.') target-counter(attr(href), page) }
			.toc, .index, .songs { -moz-column-count:2; -webkit-column-count:2; column-count:2 }
			
			.songs { page:songs; page-break-before:left }
			.songs h1 { border-color:#04C }
			.songview { margin-bottom:1em }
		</style>
	</head>
	<body>
		<%-- create front page --%>
		<div class="front-page">
			<div>
				<div class="name">${songbook.name}</div>
				<div class="author">${songbook.author}</div>
				<div class="date"><g:formatDate format="dd. MMMM, yyyy" date="${songbook.lastUpdated}"/></div>
			</div>
		</div>
		<%-- create blank page --%>
		<%-- sort songs by name --%>
		<g:set var="songsByName" value="${songbook.songs.sort{a,b -> a.name < b.name ? -1 : 1}}" />
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
				<a name="${song.id}"></a>
				<song:render>${song.text}</song:render>
			</g:each>
		</div>
		<%-- create index by author --%>
		<div class="index">
			<h1>Index</h1>
			<g:set var="currentAuthor" value="" />
			<g:each in="${songbook.songs.sort{a,b -> (a.author == b.author) ? (a.name < b.name ? -1 : 1) : (a.author < b.author ? -1 : 1) }}" var="song">
				<g:if test="${currentAuthor != song.author}">
					<g:set var="currentAuthor" value="${song.author}" />
					<h2>${song.author}</h2>
				</g:if>
				<a href="#${song.id}">${song.name}</a><br></br>
			</g:each>
		</div>
		<g:if test="${print}">
			<script type="text/javascript">
				window.print();
			</script>
		</g:if>
	</body>
</html>
