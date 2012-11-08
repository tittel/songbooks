package songbooks


class SongTagLib {
	static namespace = "song"
	
	def render = { attrs, body ->
		def source = body()
	    // cleanup: trim source
	    source = source.trim()
		// cleanup: replace html tags (against injection etc.) 
	    source = source.replaceAll("<", "\u2264").replaceAll(">", "\u2265")
	    // cleanup: remove leading whitespace in every line
	    source = source.replaceAll(/(?m)^[ ]+/, "")
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
		
		def parser = new XmlParser()
		def sw = new StringWriter()
		def printer = new XmlNodePrinter(new PrintWriter(sw))
		// convert text nodes to verse blocks and make lyric and chord lines for verses and chorus
		parser.parseText("<root>" + source + "</root>").children().each {
			if (it instanceof String) {
				it.split("\n\n").each {
					sw.append("<div class='verse'>\n")
					createLines(it, sw)
					sw.append("</div>\n")
				}
			}
			else if (it.@class == "chorus") {
				sw.append("<div class='chorus'>\n") 
				it.children().each {
					if (it instanceof String) {
						createLines(it, sw)
					}
					else {
						printer.print(it)
					}
				}
				sw.append("</div>\n") 
			}
			else {
				printer.print(it)
			}
		}

		source = "<div class='songview'>\n" + sw.toString() + "</div>"

		out << source
	}
	
	def chord = { attrs, body ->
		println "CREATING CHORD FROM -> attrs=" + attrs + ", body=" + body()
		out << ("huh".bytes as byte[])
	}
	
	def createLines(text, sw) {
		text.split("\n").each {
			def line = it.trim();
			if (line.length() > 0) {
				sw.append("<div class='line'>\n")
				createCells(line, sw)
				sw.append("</div>\n")
			}
		}
		return sw.toString()
	}
	
	def createCells(line, sw) {
		def m = (line =~ /(\[.*?\])/)
		def split = []
		def lastMatch = 0
		while(m.find()) {
		   // grab the string in between the end of the last match
		   // and the start of the current one (empty string if none)
		   split << line.substring(lastMatch, m.start())
		   // grab the delimiter
		   split << m.group()
		   // keep looking from the end of the current match
		   lastMatch = m.end()
		}
		// grab everything after the end of the last match
		split << line.substring(lastMatch)
		
		if (split.size == 1) {
			// line contains no chords, early out
			sw.append(line)
		}
		else {
			def chords = "";
			def lyrics = "";
			def lastAddedWasChord = split[0].length() > 0 && '[' == split[0].charAt(0)
 
			split.each {
				if (it.length() > 1 && '[' == it.charAt(0) && ']' == it.charAt(it.length() - 1)) {
					chords += "<span>" + it.replaceAll(/\[|\]/, "") + "</span>";
					if (lastAddedWasChord) {
						lyrics += "<span></span>";
					}
					lastAddedWasChord = true;
				}
				else if (it.trim().length() > 0) {
					lyrics += "<span><span class='sep'></span><span class='fragment'>" + it + "</span></span>";
					if (!lastAddedWasChord) {
						chords += "<span></span>";
					}
					lastAddedWasChord = false;
				}
			}
			if (lastAddedWasChord && lyrics.length() > 0) {
				lyrics += "<span></span>";
			}
			
			sw.append("<div class='chords'>\n" + chords + "</div>\n" + (lyrics.length() > 0 ? "<div class='lyrics'>\n" + lyrics + "</div>\n" : ""))
		}
	}
}
