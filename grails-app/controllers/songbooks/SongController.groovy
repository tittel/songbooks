package songbooks

import grails.converters.JSON

class SongController {
    def list() {
		render Song.list() as JSON
	}
	
	def create() {
		def song = new Song()
		try {
			println "incoming text -> " + request.JSON.text
			song.text = request.JSON.text
			if (song.save(flush:true)) {
				response.status = 201
				response.setHeader("Location", createLink(controller:"") + "/api/song/" + song.id);
				render song as JSON // Backbone needs the model to interpret the response as a success
			}
			else {
				render(status: 403, text: "Could not create new Song due to errors:\n ${song.errors}")
			}
		}
		catch(e) {
			println e
			render(status:400, text:"Please specify name and author of the song with\n<b>{t:<i>Name</i>}</b> and\n<b>{st:<i>Author</i>}</b>")
		}
	}

	def show(Long id) {
		def song = retrieveSong(id)
		if (song) {
			def result = song
			def songbookId = params.songbookId
			if (songbookId && songbookId.isLong()) {
				def songbook = retrieveSongbook(songbookId.toLong())
				if (!songbook) {
					return
				}
				def contained = songbook.songs.contains(song) 
				result = JSON.parse((song as JSON).toString())
				result.put("containedInSongbook", contained)
			}
			render result as JSON
		}
	}

	def save(Long id) {
		update(id, null)
	}

	def update(Long id, Long version) {
		def song = retrieveSong(id)
		if (song) {
			if (version != null && song.version > version) {
				song.errors.rejectValue("version", "default.optimistic.locking.failure",
						  [message(code: 'song.label', default: 'Song')] as Object[],
						  "Another user has updated this Song while you were editing")
				// 409 = HTTP status "Conflict"
				render(status:409, text:"Could not update Song due to errors:\n ${song.errors}")
			}
			else {
				try {
					song.text = request.JSON.text
					
					if (song.save(flush:true)) {
						render(status:204)
					}
					else {
						render(status:500, text:"Could not update Song due to errors:\n ${song.errors}")
					}
				}
				catch(e) {
					render(status:400, text:"Please specify name and author of the song with respective chopro tags")
				}
			}
		}
	}

	def delete(Long id) {
		def song = retrieveSong(id)
		if (song) {
			try {
				song.delete(flush:true)
				render(status:204, text:message(code: 'default.deleted.message', args: [message(code: 'song.label', default: 'Song'), id]))
			}
			catch (e) {
				render(status:500, text:message(code: 'default.not.deleted.message', args: [message(code: 'song.label', default: 'Song'), id]))
			}
		}
	}
	
	def retrieveSong(Long id) {
		def song = Song.get(id)
		if (!song) {
			log.warn "song $id not found."
			render(status:404, text:message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), id]))
		}
		return song
	}
	
	def retrieveSongbook(Long id) {
		def songbook = Songbook.get(id)
		if (!songbook) {
			log.warn "songbook $id not found."
			render(status:404, text:message(code: 'default.not.found.message', args: [message(code: 'songbook.label', default: 'Songbook'), id]))
		}
		return songbook;
	}
}
