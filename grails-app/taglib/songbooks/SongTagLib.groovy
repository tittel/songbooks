package songbooks

import org.apache.batik.transcoder.TranscoderInput
import org.apache.batik.transcoder.TranscoderOutput
import org.apache.batik.transcoder.image.PNGTranscoder


class SongTagLib {
	static namespace = "song"
	static PAGE_SIZES = [
		"A4" : "210mm 297mm",
		"A4L" : "297mm 210mm",
		"A5" : "148mm 210mm",
		"A5L" : "210mm 148mm"
	]

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

	def renderPageSize = { attrs, body ->
		def size = PAGE_SIZES.get(body())
		if (!size) {
			size = "148mm 210mm"
		}
		out << "size:" + size
	}

	def chord = { attrs, body ->
		println "CREATING CHORD FROM -> attrs=" + attrs + ", body=" + body()
		byte[] streamBytes
		PNGTranscoder t = new PNGTranscoder();
		TranscoderInput input = new TranscoderInput(new ByteArrayInputStream(streamBytes));
		ByteArrayOutputStream ostream = new ByteArrayOutputStream();
		TranscoderOutput output = new TranscoderOutput(ostream);

		t.transcode(input, output);

		ostream.flush();
		// ostream.close();
//		return ostream;


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
	
	def createChordSVG(define) {
		def svg = ""
		// collapse white space
		define = define.replaceAll(/\s+/, " ")
		def split = define.split(" ")
		def name = null, offset = null, frets = null
		if (split.length == 10 && "base-fret" == split[1] && "frets" == split[3]) {
			name = split[0]
			offset = Integer.parseInt(split[2])
			frets = split.slice(4);
		}
		else if (split.length == 8) {
			name = split[0];
			offset = Integer.parseInt(split[1]);
			frets = split.slice(2).reverse();
		}
		if (name && name.length > 0 && offset && frets && frets.length === 6) {
			def clampAtFret = 26
			def maxFret = 0
			frets.eachWithIndex { value, index ->
				def pos = Integer.parseInt(value)
				if (pos) {
					// robustness: clamp fret value to some maximum (else we could be drawing endlessly)
					if (pos > clampAtFret) {
						pos = clampAtFret
						frets[index] = pos
					}
					if (pos > maxFret) {
						maxFret = pos
					}
				}
			}
			maxFret++
	
			def numVerticalLines = 6
			def numHorizontalLines = Math.max(maxFret, 4) + 1
			
			def w = 80
			def h = 1.6 * w
			def strokeWidth = 2
			def nameFontsize = 0.2 * w
			def offsetFontsize = 0.14 * w
			def topFretFontsize = 0.13 * w
			def padding = [ top:1.4 * nameFontsize + topFretFontsize, right:0.5 * topFretFontsize, bottom:strokeWidth/2, left:offsetFontsize * 1.5 ]
			def fretDiff = (h - padding.top - padding.bottom) / (numHorizontalLines - 1)
			def radius = 0.5 * topFretFontsize
	
			svg += "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 " + w + " " + h + "' preserveAspectRatio='xMinYMin meet'>"
			// draw chord name
			svg += "<text x='" + (padding.left - strokeWidth) + "' y='" + nameFontsize + "px' style='font-weight:bold; font-size:" + nameFontsize + "px'>" + name +  "</text>"

/*			
			// chord offset
			if (!isNaN(offset) && offset > 0) {
				svg += "<text x='" + (padding.left - 4) + "' y='" + (padding.top + 0.5 * offsetFontsize) + "' style='text-anchor:end; font-size:" + offsetFontsize + "px; font-weight:bold'>" + offset + "</text>"
			}
			
			// draw chord positions (circles and top fret notations)
			frets.each {
				def fret = Integer.parseInt(it)
				def x = (padding.left + index * ((w - padding.left - padding.right) / (numVerticalLines - 1)))
				if (isNaN(fret) || fret < 0) {
					svg += "<text x='" + x + "' y='" + (padding.top - 0.4 * topFretFontsize) + "' style='text-anchor:middle; font-size:" + topFretFontsize + "px'>&#x274c;</text>"
				}
				else if (0 === fret) {
					svg += "<circle cx='" + x + "' cy='" + (padding.top - 0.75 * topFretFontsize) + "' r='" + (radius * 0.7) + "' stroke='black' stroke-width='2' fill='none' />"
				}
				else {
					svg += "<circle cx='" + x + "' cy='" + (padding.top - 0.35 * fretDiff + fret * fretDiff) + "' r='" + radius + "' fill='black' />"
				}
			}
			// draw grid
			for (var i = 0; i < numHorizontalLines; i++) {
				def y = padding.top + i * fretDiff
				svg += "<line x1='" + (padding.left - 0.5 * strokeWidth) + "' y1='" + y + "' x2='" + (w - padding.right + 0.5 * strokeWidth) + "' y2='" + y + "' style='stroke:black; stroke-width:" + strokeWidth + "'/>"
			}
			for (var i = 0; i < numVerticalLines; i++) {
				def x = padding.left + i * ((w - padding.left - padding.right) / (numVerticalLines - 1))
				svg += "<line x1='" + x + "' y1='" + padding.top + "' x2='" + x + "' y2='" + (h - padding.bottom) + "' style='stroke:black; stroke-width:" + strokeWidth + "'/>"
			}
			*/

			svg += "</svg>"
		}
		return svg
	}
	
}
