package songbooks

class SongTagLib {
	static namespace = "song"
	
	def render = { attrs, body ->
		def source = attrs.text
	    // cleanup: trim source
	    source = source.trim()
	    // cleanup: replace html tags (against injection etc.) 
	    source = source.replaceAll("<", "\u2264").replaceAll(">", "\u2265")
	    // cleanup: remove leading whitespace in every line
	    source = source.replace("^[ \t]+", "")
	    // cleanup: replace whitespace between adjacent chopro tags by single newline
	    source = source.replace("({.*?})\\s*({.*?})", "${1}\n${2}")
	    // cleanup: remove line comments
	    source = source.replace("^#.*", "")
		println source
	
	    // replace title
	    source = source.replace("\\{(t|title):(.*?)\\}", "\n\n<h1>${2}</h1>\n\n")
	    // replace subtitle
	    source = source.replace("{(st|subtitle):(.*?)}", "\n\n<h2>${2}</h2>\n\n")
	    // replace soc
	    source = source.replace("\\s*{(soc|start_of_chorus)}\\s*", "\n\n<div class='chorus'>\n")
	    // replace eoc
	    source = source.replace("\\s*{(eoc|end_of_chorus)}\\s*", "\n</div>\n\n")
	    // replace sot
	    source = source.replace("\\s*{(sot|start_of_tabs)}\\s*", "\n\n<pre class='tabs'>\n")
	    // replace eot
	    source = source.replace("\\s*{(eot|end_of_tabs)}\\s*", "\n</pre>\n\n")
	    // replace comments
	    source = source.replace("{(c|comment|ci):(.*?)}", "\n\n<div class='comment'>${2}</div>\n\n")
	    // replace chord definitions
	    source = source.replace(/{define[:]?(.*?)}/, "\n\n<div class='chord-definition'>${1}</div>\n\n")
		out << source
	}
	
	def chord = { attrs, body ->
		println "CREATING CHORD FROM -> attrs=" + attrs + ", body=" + body()
		out << ("huh".bytes as byte[])
	}
}
