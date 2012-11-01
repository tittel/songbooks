import grails.converters.JSON
import songbooks.Song
import songbooks.Songbook

class BootStrap {
	def init = { servletContext ->
		JSON.registerObjectMarshaller(Song) {
			def result = [:]
			result['id'] = it.id
			result['name'] = it.name
			result['author'] = it.author
			result['text'] = it.text
			result['containedInSongbook'] = it.containedInSongbook
			return result
		}
		
		JSON.registerObjectMarshaller(Songbook) {
			def result = [:]
			result['id'] = it.id
			result['name'] = it.name
			result['author'] = it.author
			result['props'] = it.props
			//result['songs'] = it.songs.collect{it.id}
			return result
		}
		
		if (Songbook.list().size == 0) {
			new Songbook(name:"sb name", author:"sb author", props:"").save(flush:true)
		}
		if (Song.list().size == 0) {
			new Song(text:"{t:test}{st:test}lalalala").addToSongbooks(Songbook.get(1)).save(flush:true)
		}
	}
	def destroy = {
	}
}
