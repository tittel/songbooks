package songbooks

import grails.converters.JSON
import grails.converters.XML

class SearchController {
	def list() {
		def result = [total:0, results:[]]
		if (params.q?.trim()) {
			def highlights = []
			def songHighlighter = { highlighter, index, sr ->
				def hit = sr[index]
			    highlights[index] = [
					id: hit.id, 
			        name: hit.name,
			        author: hit.author,
			        text: highlighter.fragment("text")
			    ]
			}
			def songs = Song.searchEvery(result:"every", withHighlighter:songHighlighter) {
			    queryString(params.q)
			}
			result.total = songs.size()
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
