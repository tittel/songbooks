package songbooks

import grails.converters.JSON

class SongbookController {
	def list() {
		render Songbook.list() as JSON
	}
	
	def create() {
		def songbook = new Songbook(params)
		if (songbook.save(flush:true)) {
			flash.message = message(code: 'default.created.message', args: [message(code: 'songbook.label', default: 'Songbook'), songbook.id])
			response.setHeader("Location", createLink(controller:"") + "/api/songbook/" + songbook.id)
			render(status: 201)
		}
		else {
			render(status: 403, text: "Could not create new Songbook due to errors:\n ${songbook.errors}")
		}
	}
	
	def show(Long id) {
		def songbook = retrieveSongbook(id)
		if (songbook) {	
			render songbook as JSON
		}
	}
	
	def save(Long id) {
		update(id,null)
	}

	def update(Long id, Long version) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			if (version != null && songbook.version > version) {
				songbook.errors.rejectValue("version", "default.optimistic.locking.failure",
						  [message(code: 'songbook.label', default: 'Songbook')] as Object[],
						  "Another user has updated this Songbook while you were editing")
				response.status = 403
				flash.message = "Could not update Songbook due to errors:\n ${songbook.errors}"
				render flash as JSON
			}
			else {
				songbook.properties = params
		
				if (songbook.save(flush: true)) {
					render(status:204)
				}
				else {
					response.status = 500
					flash.message = "Could not update Songbook due to errors:\n ${songbook.errors}"
					render flash as JSON
				}
			}
		}
	}

	def delete(Long id) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			try {
				songbook.delete(flush: true)
				flash.message = message(code: 'default.deleted.message', args: [message(code: 'songbook.label', default: 'Songbook'), id])
				response.status = 200
				render flash as JSON
			}
			catch (e) {
				flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'songbook.label', default: 'Songbook'), id])
				response.status = 500
				render flash as JSON
			}
		}
	}

	def listSong(Long id) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			render songbook.songs as JSON
		}
	}

	def createSong(Long id) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			def song = params.songId ? Song.get(params.songId) : null
			if (song) {
				songbook.songs.add(song)
				songbook.save(flush:true)
				render(status: 201, text: 'song added to songbook')
			}
			else {
				flash.message = message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), params.songId])
				response.status = 404;
				log.warn "song '$params.songId' not found."
				render flash as JSON
			}
		}
	}

	def deleteSong(Long id, Long songId) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			def song = songId ? Song.get(songId) : null
			if (song) {
				songbook.songs.remove(song)
				songbook.save(flush:true)
				render(status: 200, text: 'song deleted from songbook')
			}
			else {
				flash.message = message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), songId])
				response.status = 404;
				log.warn "song '$songId' not found."
				render flash as JSON
			}
		}
	}

	def retrieveSongbook(Long id) {
		def songbook = Songbook.get(id)
		if (!songbook) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'songbook.label', default: 'Songbook'), id])
			response.status = 404;
			log.warn "songbook $id not found."
			render flash as JSON
		}
		return songbook;
	}
}
