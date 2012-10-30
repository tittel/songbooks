import grails.converters.JSON
import songbooks.Song
import songbooks.Songbook

class BootStrap {
	def init = { servletContext ->
		JSON.registerObjectMarshaller(Song) {
			def returnArray = [:]
			returnArray['id'] = it.id
			returnArray['name'] = it.name
			returnArray['author'] = it.author
			returnArray['text'] = it.text
			return returnArray
		}
		JSON.registerObjectMarshaller(Songbook) {
			def returnArray = [:]
			returnArray['id'] = it.id
			returnArray['name'] = it.name
			returnArray['author'] = it.author
			return returnArray
		}
		
/*
		if (Songbook.list().size() == 0) {
			new Songbook(name:"Songbook von Stephan", author:"Stephan").save(flush:true)
		}
		if (Song.list().size() == 0) {
			new Song(text:"{t:Running to Stand Still}{st:U2}lalalalalala").save(flush:true)
		}
*/		
	}
	def destroy = {
	}
}
