package songbooks

import java.awt.image.BufferedImage

import javax.imageio.ImageIO

import org.im4java.core.ConvertCmd
import org.im4java.core.IMOperation
import org.im4java.core.Stream2BufferedImage
import org.im4java.process.Pipe


class SongTagLib {
	static namespace = "song"
	static PAGE_SIZES = [
		"A4" : "210mm 297mm",
		"A4L" : "297mm 210mm",
		"A5" : "148mm 210mm",
		"A5L" : "210mm 148mm"
	]

	def render = { attrs, body ->
		def songId = attrs.songId
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
		// cleanup: replace ampersands by placeholder to not break XML parsing
		source = source.replaceAll(/&/, "@blubb@")
		// replace title
		source = source.replaceAll(/\{(t|title):\s*(.*?)\s*\}/, "\n\n<h1>" + (songId ? "<a name='${songId}'></a>" : "") + "\$2</h1>\n\n")
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
		// replace comment tags
		source = source.replaceAll(/\{(c|comment|ci):\s*(.*?)\s*\}/, "\n\n<div class='comment'>\$2</div>\n\n")
		// replace chord definitions
		source = source.replaceAll(/\{define[:]?\s*(.*?)\s*\}/, "\n\n<div class='chord-definition'>\$1</div>\n\n")
		
		def sw = new StringWriter()
		def printer = new XmlNodePrinter(new PrintWriter(sw))
		printer.preserveWhitespace = true
		
		// convert text nodes to verse blocks and make lyric and chord lines for verses and chorus
		new XmlParser().parseText("<root>" + source + "</root>").children().each {
			if (it instanceof String) {
				it.split("\n\n").each {
					sw.append("<div class='verse'>\n")
					createLines(it, sw)
					sw.append("</div>\n")
				}
			}
			else if (it.@class == "chorus") {
				sw.append("<div class='chorus sticky'>\n")
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
			else if (it.@class == "chord-definition") {
				def png = createChordPNG(it.text())
				if (png) {
					sw.append("<img class='chord-definition' src='data:image/png;base64,")
					sw.append(createChordPNG(it.text()))
					sw.append("' />")
				}
				else {
					log.warn("couldn't convert chord definition '" + it.text() + "'")
				}
			}
			else {
				printer.print(it)
			}
		}
		source = "<div class='songview'>\n" + sw.toString() + "\n</div>"

		// cleanup: replace ampersand placeholder 
		source = source.replaceAll(/@blubb@/, "&amp;")
		// make song header stick together, so that there will be no page/column break inside
		source = source.replaceAll(/(<h1>.*?<\/h1>\s*<h2>.*?<\/h2>)/, "<div class='sticky'>\$1</div>")

		out << source
	}

	def renderPageSize = { attrs, body ->
		def size = PAGE_SIZES.get(body())
		if (!size) {
			size = "148mm 210mm"
		}
		out << "size:" + size
	}

	def createLines(text, sw) {
		text.split("\n").each {
			def line = it.trim()
			if (line.length() > 0) {
				sw.append("<div class='line sticky'>\n")
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
			def chords = ""
			def lyrics = ""
			def lastAddedWasChord = split[0].length() > 0 && '[' == split[0].charAt(0)

			split.each {
				if (it.length() > 1 && '[' == it.charAt(0) && ']' == it.charAt(it.length() - 1)) {
					chords += "<span>" + it.replaceAll(/\[|\]/, "") + "</span>"
					if (lastAddedWasChord) {
						lyrics += "<span></span>"
					}
					lastAddedWasChord = true
				}
				else if (it.trim().length() > 0) {
					lyrics += "<span><span class='sep'></span><span class='fragment'>" + it + "</span></span>"
					if (!lastAddedWasChord) {
						chords += "<span></span>"
					}
					lastAddedWasChord = false
				}
			}
			if (lastAddedWasChord && lyrics.length() > 0) {
				lyrics += "<span></span>"
			}

			sw.append("<div class='chords'>\n" + chords + "</div>\n" + (lyrics.length() > 0 ? "<div class='lyrics'>\n" + lyrics + "</div>\n" : ""))
		}
	}

	def createChordPNG(define) {
		def png = null
		
		IMOperation op = new IMOperation()
		op.addImage("svg:-") // input: stdin
//		op.antialias()
		op.addImage("png:-") // output: stdout

		def svg = createChordSVG(define)
		if (svg) {
			def inputStream = new ByteArrayInputStream(svg.bytes)
			def outputStream = new ByteArrayOutputStream()
			def pipe = new Pipe(inputStream, outputStream)
	
			ConvertCmd convert = new ConvertCmd()
			convert.setInputProvider(pipe)
			convert.setOutputConsumer(pipe)
			convert.run(op)
	
			inputStream.close()
			outputStream.flush()
			png = outputStream.toByteArray().encodeBase64() as String
			outputStream.close()
		}
		return png
	}

	def createChordSVG(define) {
		def svg = null
		// collapse white space
		define = define.replaceAll(/\s+/, " ")
		def split = define.split(" ")
		def name = null, offset = -1, frets = null
		if (split.length == 10 && "base-fret" == split[1] && "frets" == split[3]) {
			name = split[0]
			offset = split[2].isInteger() ? Integer.parseInt(split[2]) : 0
			frets = split[4..9]
		}
		else if (split.length == 8) {
			name = split[0]
			offset = split[1].isInteger() ? Integer.parseInt(split[1]) : 0
			frets = split[2..7].reverse()
		}
		if (name && name.length() > 0 && offset > -1 && frets && frets.size() == 6) {
			def clampAtFret = 26
			def maxFret = 0
			frets.eachWithIndex { value, index ->
				if (value.isInteger()) {
					def pos = Integer.parseInt(value)
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

			def w = 60
			def h = 1.6 * w
			def strokeWidth = Math.max(1, Math.round(0.025 * w))
			def nameFontsize = 0.18 * w
			def offsetFontsize = 0.14 * w
			def topFretFontsize = 0.13 * w
			def padding = [ top:1.4 * nameFontsize + topFretFontsize, right:0.5 * topFretFontsize, bottom:strokeWidth/2, left:offsetFontsize * 1.5 ]
			def fretDiff = (h - padding.top - padding.bottom) / (numHorizontalLines - 1)
			def radius = 0.5 * topFretFontsize

			svg = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='" + w + "px' height='" + h + "px' viewBox='0 0 " + w + " " + h + "' preserveAspectRatio='xMinYMin meet'>"
			// draw chord name
			svg += "<text x='" + (padding.left - strokeWidth) + "' y='" + nameFontsize + "px' style='shape-rendering:crispEdges; font-weight:bold; font-family:sans-serif; font-size:" + nameFontsize + "px'>" + name +  "</text>"

			// chord offset
			if (offset > 0) {
				svg += "<text x='" + (padding.left - 4) + "' y='" + (padding.top + 0.5 * offsetFontsize) + "' style='shape-rendering:crispEdges; font-family:sans-serif; text-anchor:end; font-size:" + offsetFontsize + "px'>" + offset + "</text>"
			}

			// draw chord positions (circles and top fret notations)
			frets.eachWithIndex { it, index ->
				def fret = it.isInteger() ? Integer.parseInt(it) : -1
				def x = (padding.left + index * ((w - padding.left - padding.right) / (numVerticalLines - 1)))
				if (fret < 0) {
					// draw "x" with lines
					def d = topFretFontsize * 0.3
					def y = padding.top- 0.75 * topFretFontsize
					svg += "<line x1='"+(x-d)+"' y1='"+(y-d)+"' x2='"+(x+d)+"' y2='"+(y+d)+"' style='shape-rendering:crispEdges; stroke:black; stroke-width:" + strokeWidth + "'/>"
					svg += "<line x1='"+(x-d)+"' y1='"+(y+d)+"' x2='"+(x+d)+"' y2='"+(y-d)+"' style='shape-rendering:crispEdges; stroke:black; stroke-width:" + strokeWidth + "'/>"
				}
				else if (0 == fret) {
					svg += "<circle cx='" + x + "' cy='" + (padding.top - 0.75 * topFretFontsize) + "' r='" + (radius * 0.7) + "' stroke='black' stroke-width='" + strokeWidth + "' fill='none' />"
				}
				else {
					svg += "<circle cx='" + x + "' cy='" + (padding.top - 0.35 * fretDiff + fret * fretDiff) + "' r='" + radius + "' fill='black' />"
				}
			}
			// draw grid
			for (i in 0..numHorizontalLines-1) {
				def y = padding.top + i * fretDiff
				svg += "<line x1='" + (padding.left - 0.5 * strokeWidth) + "' y1='" + y + "' x2='" + (w - padding.right + 0.5 * strokeWidth) + "' y2='" + y + "' style='shape-rendering:crispEdges; stroke:black; stroke-width:" + strokeWidth + "'/>"
			}
			for (i in 0..numVerticalLines-1) {
				def x = padding.left + i * ((w - padding.left - padding.right) / (numVerticalLines - 1))
				svg += "<line x1='" + x + "' y1='" + padding.top + "' x2='" + x + "' y2='" + (h - padding.bottom) + "' style='shape-rendering:crispEdges; stroke:black; stroke-width:" + strokeWidth + "'/>"
			}

			svg += "</svg>"
		}
		return svg
	}

}
