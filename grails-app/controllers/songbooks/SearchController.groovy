package songbooks

import grails.converters.JSON
import grails.converters.XML

class SearchController {
	def list() {
		def result = [total:0, results:[]]
		if (params.q?.trim()) {
			def query = params.q.trim()
			def songbookId = params.songbookId?.trim()
			def restricted = songbookId && songbookId.isLong()
			if (restricted) {
				query = query + " +\$/Song/songbooks/id:" + songbookId;
			}
			
			println "--- QUERY='" + query + "'"	
			
			def highlights = []
			def songs = Song.searchEvery(query, withHighlighter: { highlighter, index, sr ->
				def hit = sr[index]
				def nameHighlight = highlighter.fragment("name")
				def authorHighlight = highlighter.fragment("author")
				def textHighlight = highlighter.fragment("text")
			    highlights.add( [		
					id: hit.id, 
			        name: nameHighlight ? nameHighlight : hit.name,
			        author: authorHighlight ? authorHighlight : hit.author,
			        text: textHighlight ? textHighlight + "&hellip;" : ""
			    ])
			})
			result.total = highlights.size
			result.results = highlights
			result.size = restricted ? Songbook.get(songbookId).songs.size() : Song.list().size
		}
		render result as JSON
	}
}
