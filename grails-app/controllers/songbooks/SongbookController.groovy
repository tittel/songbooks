package songbooks

import grails.converters.JSON

class SongbookController {
	def pdfRenderingService
	
	def list() {
		render Songbook.list() as JSON
	}
	
	def create() {
		def songbook = new Songbook(request.JSON)
		if (songbook.save(flush:true)) {
			response.status = 201
			response.setHeader("Location", createLink(controller:"") + "/api/songbook/" + songbook.id);
			render songbook as JSON // Backbone needs the model to interpret the response as a success
		}
		else {
			render(status: 400, text: "Could not create new Songbook due to errors:\n ${songbook.errors}")
		}
	}
	
	def show(Long id) {
		def songbook = retrieveSongbook(id)
		if (songbook) {	
			render songbook as JSON
		}
	}
	
	def save(Long id) {
		update(id, null)
	}

	def update(Long id, Long version) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			if (version != null && songbook.version > version) {
				songbook.errors.rejectValue("version", "default.optimistic.locking.failure",
						  [message(code: 'songbook.label', default: 'Songbook')] as Object[],
						  "Another user has updated this Songbook while you were editing")
				// 409 = HTTP status "Conflict"
				render(status:409, text:"Could not update Songbook due to errors:\n ${songbook.errors}")
			}
			else {
				if (request.JSON.name) {
					songbook.name = request.JSON.name
				}
				if (request.JSON.author) {
					songbook.author = request.JSON.author
				}
				if (request.JSON.format) {
					songbook.format = request.JSON.format
				}

				if (songbook.save(flush:true)) {
					render(status:204)
				}
				else {
					response.status = 500
					render(status:500, text:"Could not update Songbook due to errors:\n ${songbook.errors}")
				}
			}
		}
	}

	def delete(Long id) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			try {
				songbook.delete(flush:true)
				render(status:204, text:message(code: 'default.deleted.message', args: [message(code: 'songbook.label', default: 'Songbook'), id]))
			}
			catch (e) {
				render(status:500, text:message(code: 'default.not.deleted.message', args: [message(code: 'songbook.label', default: 'Songbook'), id]))
			}
		}
	}

	def listSong(Long id) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			def result = []
			songbook.songs.each { song ->
				result.add([
					id : song.id,
					name : song.name,
					author : song.author
				])
			}
			
			render result.sort{a,b -> a.name < b.name ? -1 : 1} as JSON
		}
	}

	def createSong(Long id) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			def song = params.songId ? Song.get(params.songId) : null
			if (song) {
				songbook.addToSongs(song)
				songbook.save(flush:true)
				render(status: 200, text: 'song added to songbook')
			}
			else {
				log.warn "song '$params.songId' not found."
				render(status:404, text:message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), params.songId]))
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
				log.warn "song '$songId' not found."
				render(status:404, text:message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), params.songId]))
			}
		}
	}
	
	def export(Long id) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			// check if export is already in progress
			if (songbook.exportState == 1) {
				render(status:400, text:"pdf generation already in progress...")
			}
			else {
				runAsync {
					def sb = retrieveSongbook(id)
					try {
						sb.exportState = 1
						sb.save(flush:true)
						def outputStream = pdfRenderingService.render(template:"/pdf/songbook", model:[songbook:sb])
						sb.exportData = outputStream.toByteArray()
						sb.exportState = 2
						sb.save(flush:true)
					}
					catch (e) {
						log.error e
						sb.exportState = 0
						sb.save(flush:true)
					}
				}
				
				render(status:204, text:"pdf generation started")
			}
		}
	}

	def download(Long id) {
		def songbook = retrieveSongbook(id)
		if (songbook) {
			// check if export exists
			if (songbook.exportState != 2) {
				render(status:404, text:"pdf export not existing")
			}
			else {
				def filename = songbook.name.replaceAll(" ", "_") + "-${songbook.format}-" + formatDate(format:'yyMMdd', date:songbook.lastUpdated) + ".pdf"
			    OutputStream out = response.getOutputStream()
			    response.setContentLength(songbook.exportData.length)
			    response.addHeader("Content-disposition", "attachment; filename=${filename}")
			    response.addHeader("Content-type", "application/pdf")
			    out.write(songbook.exportData)
			    out.close()
			}
		}
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
