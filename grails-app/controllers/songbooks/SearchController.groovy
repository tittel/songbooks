package songbooks

import grails.converters.JSON
import grails.converters.XML

class SearchController {
	def list() {
		def result = [total:0, results:[]]
		if (params.q?.trim()) {
			try {
				def hits = Song.search(params.q, params)
				result.total = hits.total
				result.results = hits.results
			}
			catch (e) {
				log.warn e
			}
		}
		render result as JSON
	}
}
