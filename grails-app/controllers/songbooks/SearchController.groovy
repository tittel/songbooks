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
				def textHighlight = highlighter.fragment("text")
			    highlights[index] = [
					id: hit.id, 
			        name: nameHighlight ? nameHighlight : hit.name,
			        author: authorHighlight ? authorHighlight : hit.author,
			        text: textHighlight ? textHighlight + "&hellip;" : ""
			    ]
			})
			result.total = highlights.size
			result.results = highlights
			result.size = Song.list().size
		}
		render result as JSON
	}
}
