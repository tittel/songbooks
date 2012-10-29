function choproToHtml($, source) {
    // cleanup: trim source
    source = $.trim(source);
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
    source = source.replace(/{(c|comment):(.*?)}/g, "\n\n<div class='comment'>$2</div>\n\n");
    
    var $source = $("<div class='songview'>" + source + "</div>");
    
    // create verse blocks
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
    
    // create lines, lyric lines and chord lines
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
    return $source;
}

function htmlToChopro($, rootNode) {
    var template = '<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet><xsl:template match="/"><xsl:apply-templates /></xsl:template><xsl:template match="h1">{t:<xsl:value-of select="text()" />}\n</xsl:template><xsl:template match="h2">{st:<xsl:value-of select="text()" />}\n</xsl:template><xsl:template match="*[@class=\'comment\']">\n{c:<xsl:value-of select="text()" />}\n</xsl:template><xsl:template match="*[@class=\'tabs\']">\n{sot}\n<xsl:apply-templates />{eot}\n</xsl:template><xsl:template match="*[@class=\'chorus\']">\n{soc}<xsl:apply-templates />{eoc}\n</xsl:template><xsl:template match="*[@class=\'verse\']"><xsl:apply-templates />\n</xsl:template><xsl:template match="*[@class=\'chord\']">[<xsl:value-of select="text()" />]</xsl:template><xsl:template match="text()"><xsl:value-of select="." /></xsl:template><xsl:template match="*[@class=\'textline\']"><xsl:apply-templates />\n</xsl:template></xsl:stylesheet>';
    $target = $("<div/>");
    $target.xslt({xml: rootNode, xsl: template});
    var chopro = $.trim($target.text());
    return chopro;
}

function createCells($, line) {
	var cells;
	var split = line.split(/(\[.*?\])/g);
	if (split.length == 1) {
		// line contains no chords, early out
		cells = line;
	}
	else {
//		console.log(split);

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
