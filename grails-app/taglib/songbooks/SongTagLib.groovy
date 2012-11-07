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
	    source = source.replaceAll(/(?m)^\s+/, "")
	    // cleanup: replace whitespace between adjacent chopro tags by single newline
	    source = source.replaceAll(/(\{.*?\})\s*(\{.*?\})/, "\$1\n\$2")
	    // cleanup: remove line comments
	    source = source.replaceAll(/(?m)^#.*/, "")
	
	    // replace title 
	    source = source.replaceAll(/\{(t|title):\s*(.*?)\s*\}/, "\n\n<h1>\$2</h1>\n\n")
	    // replace subtitle
	    source = source.replaceAll(/\{(st|subtitle):\s*(.*?)\s*\}/, "\n\n<h2>\$2</h2>\n\n")
	    // replace soc
	    source = source.replaceAll(/\{(soc|start_of_chorus)\s*\}/, "\n\n<div class='chorus'>\n")
	    // replace eoc
	    source = source.replaceAll(/\{(eoc|end_of_chorus)\s*\}/, "\n</div>\n\n")
	    // replace sot
	    source = source.replaceAll(/\{(sot|start_of_tabs)\s*\}/, "\n\n<pre class='tabs'>\n")
	    // replace eot
	    source = source.replaceAll(/\{(eot|end_of_tabs)\s*\}/, "\n</pre>\n\n")
	    // replace comments
	    source = source.replaceAll(/\{(c|comment|ci):\s*(.*?)\s*\}/, "\n\n<div class='comment'>\$2</div>\n\n")
	    // replace chord definitions
	    source = source.replaceAll(/\{define[:]?(.*?)\s*\}/, "\n\n<div class='chord-definition'>\$1</div>\n\n")
		
		println "-----------------------------------------------------------------------"
		println source
		
		out << source
	}
	
	def chord = { attrs, body ->
		println "CREATING CHORD FROM -> attrs=" + attrs + ", body=" + body()
		out << ("huh".bytes as byte[])
	}
}
