package songbooks

import grails.converters.JSON
import grails.converters.XML

class SearchController {
	def list() {
		def result = [total:0, results:[]]
		if (params.q?.trim()) {
			def highlights = []
			def songs = Song.searchEvery(params.q, withHighlighter: { highlighter, index, sr ->
				def hit = sr[index]
				def nameHighlight = highlighter.fragment("name")
				def authorHighlight = highlighter.fragment("author")
			    highlights[index] = [
					id: hit.id, 
			        name: nameHighlight ? nameHighlight : hit.name,
			        author: authorHighlight ? authorHighlight : hit.author,
			        text: highlighter.fragment("text") + "&hellip;"
			    ]
			})
			result.total = highlights.size()
			result.results = highlights
/*			
			try {
				def hits = Song.search(params.q, params)
				println hits
				result.total = hits.total
				result.results = hits.results
			}
			catch (e) {
				log.warn e
			}
*/		
		}
		render result as JSON
	}
}
