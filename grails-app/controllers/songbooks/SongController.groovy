package songbooks

import grails.converters.JSON

class SongController {
    def list() {
		render Song.list() as JSON
	}
	
	def create() {
		def song = Song.parse(params.text, true)
		if (song.save(flush:true)) {
			flash.message = message(code: 'default.created.message', args: [message(code: 'song.label', default: 'Song'), song.id])
			response.setHeader("Location", createLink(controller:"") + "/api/song/" + song.id)
			render(status: 201)
		}
		else {
			render(status: 403, text: "Could not create new Song due to errors:\n ${song.errors}")
		}
	}

	def show(Long id) {
		def song = retrieveSong(id)
		if (song) {
			render song as JSON
		}
	}

	def save(Long id) {
		update(id,null)
	}

	def update(Long id, Long version) {
		def song = retrieveSong(id)
		if (song) {
			if (version != null && song.version > version) {
				song.errors.rejectValue("version", "default.optimistic.locking.failure",
						  [message(code: 'song.label', default: 'Song')] as Object[],
						  "Another user has updated this Song while you were editing")
				response.status = 403
				flash.message = "Could not update Song due to errors:\n ${song.errors}"
				render flash as JSON
			}
			else {
				song.properties = params
		
				if (song.save(flush: true)) {
					render(status:204)
				}
				else {
					response.status = 500
					flash.message = "Could not update Song due to errors:\n ${song.errors}"
					render flash as JSON
				}
			}
		}
	}

	def delete(Long id) {
		def song = retrieveSong(id)
		if (song) {
			try {
				song.delete(flush: true)
				flash.message = message(code: 'default.deleted.message', args: [message(code: 'song.label', default: 'Song'), id])
				response.status = 200
				render flash as JSON
			}
			catch (e) {
				flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'song.label', default: 'Song'), id])
				response.status = 500
				render flash as JSON
			}
		}
	}
	
	def retrieveSong(Long id) {
		def song = Song.get(id)
		if (!song) {
			log.warn "song $id not found."
			response.status = 404
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), id])
			render flash as JSON
		}
		return song
	}
}
