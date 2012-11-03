import grails.converters.JSON
import grails.util.Environment;
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
		
		if (Environment.developmentMode) {
			if (Song.list().size == 0) {
				new File("/home/tittel/temp/chopro").eachFileMatch(~/.*\.chopro/) { file ->
					new Song(text:file.text).save(flush:true)
				}
				println "--- SONGS CREATED."
			}
			if (Songbook.list().size == 0) {
				def songbook = new Songbook(name:"Songbook", author:"Stephan", props:"")
				Song.list().each { song ->
					songbook.addToSongs(song)
				}
				songbook.save(flush:true)
				println "--- SONGBOOKS CREATED"
			}
		}
	}
	def destroy = {
	}
}
