function choproToHtml($, source) {
    // cleanup: trim source
    source = $.trim(source);
    // cleanup: replace html tags (against injection etc.) 
    source = source.replace(/</g, "\u2264").replace(/>/g, "\u2265");
    // cleanup: remove leading whitespace in every line
    source = source.replace(/^[ \t]+/mg, "");
    // cleanup: replace whitespace between adjacent chopro tags by single newline
    source = source.replace(/({.*?})\s*({.*?})/g, "$1\n$2");
    // cleanup: remove line comments
    source = source.replace(/^#.*$/mg, "");

    // replace title
    source = source.replace(/{(t|title):(.*?)}/g, "\n\n<h1>$2</h1>\n\n");
    // replace subtitle
    source = source.replace(/{(st|subtitle):(.*?)}/g, "\n\n<h2>$2</h2>\n\n");
    // replace soc
    source = source.replace(/\s*{(soc|start_of_chorus)}\s*/g, "\n\n<div class='chorus'>\n");
    // replace eoc
    source = source.replace(/\s*{(eoc|end_of_chorus)}\s*/g, "\n</div>\n\n");
    // replace sot
    source = source.replace(/\s*{(sot|start_of_tabs)}\s*/g, "\n\n<pre class='tabs'>\n");
    // replace eot
    source = source.replace(/\s*{(eot|end_of_tabs)}\s*/g, "\n</pre>\n\n");
    // replace comments
    source = source.replace(/{(c|comment|ci):(.*?)}/g, "\n\n<div class='comment'>$2</div>\n\n");
    // replace chord definitions
    source = source.replace(/{define[:]?(.*?)}/g, "\n\n<div class='chord-definition'>$1</div>\n\n");
    
    var $source = $("<div class='songview'>" + source + "</div>");
    
    // create verse blocks (which is every text node on root level right now)
    $source.contents().each(function() {
    	if (this.nodeType === 3) {
    		var $this = $(this);
    		var verses = "";
    		$.each($this.text().split("\n\n"), function(index, value) {
        		var trim = $.trim(value);
        		if (trim.length > 0) {
	    			verses += "<div class='verse'>" + trim + "</div>";
	    		}
    		});
    		$this.replaceWith(verses);
    	}
    });
    
    // create lines, lyric lines and chord lines in chorus and verse blocks
    $(".chorus,.verse", $source).each(function() {
    	$(this).contents().each(function() {
        	if (this.nodeType === 3) {
        		var $this = $(this);
        		var lines = "";
        		$.each($this.text().split("\n"), function(index, value) {
            		var line = $.trim(value);
            		if (line.length > 0) {
    	    			lines += "<div class='line'>" + createCells($, line) + "</div>";
    	    		}
        		});
        		$this.replaceWith(lines);
        	}
    	});
    });
    
    // create chord images
    $(".chord-definition", $source).each(function() {
    	$(this).html(createChordImage($, $(this).text().trim()));
    });
    return $source;
}

/*
function htmlToChopro($, rootNode) {
    var template = '<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet><xsl:template match="/"><xsl:apply-templates /></xsl:template><xsl:template match="h1">{t:<xsl:value-of select="text()" />}\n</xsl:template><xsl:template match="h2">{st:<xsl:value-of select="text()" />}\n</xsl:template><xsl:template match="*[@class=\'comment\']">\n{c:<xsl:value-of select="text()" />}\n</xsl:template><xsl:template match="*[@class=\'tabs\']">\n{sot}\n<xsl:apply-templates />{eot}\n</xsl:template><xsl:template match="*[@class=\'chorus\']">\n{soc}<xsl:apply-templates />{eoc}\n</xsl:template><xsl:template match="*[@class=\'verse\']"><xsl:apply-templates />\n</xsl:template><xsl:template match="*[@class=\'chord\']">[<xsl:value-of select="text()" />]</xsl:template><xsl:template match="text()"><xsl:value-of select="." /></xsl:template><xsl:template match="*[@class=\'textline\']"><xsl:apply-templates />\n</xsl:template></xsl:stylesheet>';
    $target = $("<div/>");
    $target.xslt({xml: rootNode, xsl: template});
    var chopro = $.trim($target.text());
    return chopro;
}
*/

function createCells($, line) {
	var cells;
	var split = line.split(/(\[.*?\])/g);
	if (split.length == 1) {
		// line contains no chords, early out
		cells = line;
	}
	else {
		var chords = "";
		var lyrics = "";
		var lastAddedWasChord = split[0].length > 0 && "[" == split[0][0];

		$.each(split, function(index, value) {
			if ("[" === value[0] && "]" === value[value.length - 1]) {
				chords += "<span>" + value.replace(/\[|\]/g, "") + "</span>";
				if (lastAddedWasChord) {
					lyrics += "<span></span>";
				}
				lastAddedWasChord = true;
			}
			else if ($.trim(value).length > 0) {
				lyrics += "<span><span class='sep'></span><span class='fragment'>" + value + "</span></span>";
				if (!lastAddedWasChord) {
					chords += "<span></span>";
				}
				lastAddedWasChord = false;
			}
		});
		if (lastAddedWasChord && lyrics.length > 0) {
			lyrics += "<span></span>";
		}
		
		cells = "<div class='chords'>" + chords + "</div>" + (lyrics.length > 0 ? "<div class='lyrics'>" + lyrics + "</div>" : ""); 
	}
	return cells;
}

function createChordImage($, def) {
	var svg = "";
	// collapse white space
	def = def.replace(/\s+/g, " ");
	var split = def.split(" ");
	var name = null, offset = null, frets = null;
	if (split.length === 10 && "base-fret" === split[1] && "frets" === split[3]) {
		name = split[0];
		offset = parseInt(split[2]);
		frets = split.slice(4);
	}
	else if (split.length === 8) {
		name = split[0];
		offset = parseInt(split[1]);
		frets = split.slice(2).reverse();
	}
	if (name && name.length > 0 && !isNaN(offset) && frets && frets.length === 6) {
		var clampAtFret = 26;
		var maxFret = 0;
		$.each(frets, function (index, value) {
			var pos = parseInt(value);
			if (!isNaN(pos) ) {
				// robustness: clamp fret value to some maximum (else we could be drawing endlessly)
				if (pos > clampAtFret) {
					pos = clampAtFret;
					frets[index] = pos;
				}
				if (pos > maxFret) {
					maxFret = pos;
				}
			}
		});
		maxFret++;

		var numVerticalLines = 6;
		var numHorizontalLines = Math.max(maxFret, 4) + 1;
		
		var w = 80;
		var h = 1.6 * w;
		var strokeWidth = 2;
		var nameFontsize = 0.2 * w;
		var offsetFontsize = 0.14 * w;
		var topFretFontsize = 0.13 * w;
		var padding = { top:1.4 * nameFontsize + topFretFontsize, right:0.5 * topFretFontsize, bottom:strokeWidth/2, left:offsetFontsize * 1.5 };
		var fretDiff = (h - padding.top - padding.bottom) / (numHorizontalLines - 1);
		var radius = 0.5 * topFretFontsize;

		svg += "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 " + w + " " + h + "' preserveAspectRatio='xMinYMin meet'>";
		// draw chord name
		svg += "<text x='" + (padding.left - strokeWidth) + "' y='" + nameFontsize + "px' style='font-weight:bold; font-size:" + nameFontsize + "px'>" + name +  "</text>";
		// chord offset
		if (!isNaN(offset) && offset > 0) {
			svg += "<text x='" + (padding.left - 4) + "' y='" + (padding.top + 0.5 * offsetFontsize) + "' style='text-anchor:end; font-size:" + offsetFontsize + "px; font-weight:bold'>" + offset + "</text>";
		}
		
		// draw chord positions (circles and top fret notations)
		$.each(frets, function (index, value) {
			var fret = parseInt(value);
			var x = (padding.left + index * ((w - padding.left - padding.right) / (numVerticalLines - 1)));
			if (isNaN(fret) || fret < 0) {
				svg += "<text x='" + x + "' y='" + (padding.top - 0.4 * topFretFontsize) + "' style='text-anchor:middle; font-size:" + topFretFontsize + "px'>&#x274c;</text>";
			}
			else if (0 === fret) {
				svg += "<circle cx='" + x + "' cy='" + (padding.top - 0.75 * topFretFontsize) + "' r='" + (radius * 0.7) + "' stroke='black' stroke-width='2' fill='none' />";
			}
			else {
				svg += "<circle cx='" + x + "' cy='" + (padding.top - 0.35 * fretDiff + fret * fretDiff) + "' r='" + radius + "' fill='black' />";
			}
		});
		// draw grid
		for (var i = 0; i < numHorizontalLines; i++) {
			var y = padding.top + i * fretDiff;
			svg += "<line x1='" + (padding.left - 0.5 * strokeWidth) + "' y1='" + y + "' x2='" + (w - padding.right + 0.5 * strokeWidth) + "' y2='" + y + "' style='stroke:black; stroke-width:" + strokeWidth + "'/>";
		}
		for (var i = 0; i < numVerticalLines; i++) {
			var x = padding.left + i * ((w - padding.left - padding.right) / (numVerticalLines - 1));
			svg += "<line x1='" + x + "' y1='" + padding.top + "' x2='" + x + "' y2='" + (h - padding.bottom) + "' style='stroke:black; stroke-width:" + strokeWidth + "'/>";
		}
		svg += "</svg>";
	}
	return svg;
}
