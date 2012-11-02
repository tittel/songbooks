import grails.converters.JSON
import songbooks.Song
import songbooks.Songbook

class BootStrap {
	def init = { servletContext ->
		JSON.registerObjectMarshaller(Song) {
			def result = [:]
			result['id'] = it.id
			result['text'] = it.text
			return result
		}
		
		JSON.registerObjectMarshaller(Songbook) {
			def result = [:]
			result['id'] = it.id
			result['name'] = it.name
			result['author'] = it.author
			result['props'] = it.props
			return result
		}
		
		if (Song.list().size == 0) {
			new Song(text:"{t:rest}{st:rest}lalalala").save(flush:true)
			new Song(text:"{t:rest}{st:rest2}nananananana").save(flush:true)
			println "--- SONGS CREATED."
		}
		if (Songbook.list().size == 0) {
			new Songbook(name:"sob1 name", author:"sob1 author", props:"").addToSongs(Song.get(1)).save(flush:true)
			new Songbook(name:"sob2 name", author:"sob2 author", props:"").addToSongs(Song.get(1)).save(flush:true)
			new Songbook(name:"sob3 name", author:"sob3 author", props:"").save(flush:true)
			println "--- SONGBOOKS CREATED"
		}
	}
	def destroy = {
	}
}
