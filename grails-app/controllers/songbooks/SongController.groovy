package songbooks

import grails.converters.JSON

class SongController {
    def list() {
		Song.list().each { song ->
			println song.id
		}
		render Song.list() as JSON
	}
	
	def create() {
		def song = new Song(params)
		if (song.save(flush:true)) {
			flash.message = message(code: 'default.created.message', args: [message(code: 'song.label', default: 'Song'), songInstance.id])
			response.status = 201 // Created
			render song as JSON
		}
		else {
			response.status = 500 //Internal Server Error
			render(status: 500, text: "Could not create new Song due to errors:\n ${song.errors}")
		}
	}

	def save(Long id) {
		def song = Song.get(id)
		if (!song) {
			render(status: 404, text: message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), id]))
			return
		}

		song.properties = params
		if (song.save(flush:true)) {
			flash.message = message(code: 'default.created.message', args: [message(code: 'song.label', default: 'Song'), songInstance.id])
			response.status = 200 // Ok
			render song as JSON
		}
		else {
			render(status: 500, text: "Could not update Song due to errors:\n ${song.errors}")
		}
	}

	def show(Long id) {
		def song = Song.get(id)
		if (!song) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), id])
			response.status = 404;
			log.warn "song $id not found."
			render flash as JSON
			return
		}
		render song as JSON
	}

	def edit(Long id) {
		def songInstance = Song.get(id)
		if (!songInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), id])
			redirect(action: "list")
			return
		}

		[songInstance: songInstance]
	}

	def update(Long id, Long version) {
		def songInstance = Song.get(id)
		if (!songInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), id])
			redirect(action: "list")
			return
		}

		if (version != null) {
			if (songInstance.version > version) {
				songInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
						  [message(code: 'song.label', default: 'Song')] as Object[],
						  "Another user has updated this Song while you were editing")
				render(view: "edit", model: [songInstance: songInstance])
				return
			}
		}

		songInstance.properties = params

		if (!songInstance.save(flush: true)) {
			render(view: "edit", model: [songInstance: songInstance])
			return
		}

		flash.message = message(code: 'default.updated.message', args: [message(code: 'song.label', default: 'Song'), songInstance.id])
		redirect(action: "show", id: songInstance.id)
	}

	def delete(Long id) {
		def songInstance = Song.get(id)
		if (!songInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'song.label', default: 'Song'), id])
			redirect(action: "list")
			return
		}

		try {
			songInstance.delete(flush: true)
			flash.message = message(code: 'default.deleted.message', args: [message(code: 'song.label', default: 'Song'), id])
			redirect(action: "list")
		}
		catch (e) {
			flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'song.label', default: 'Song'), id])
			redirect(action: "show", id: id)
		}
	}
}
