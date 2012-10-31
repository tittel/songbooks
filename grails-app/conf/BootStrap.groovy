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
			returnArray['props'] = it.props
			returnArray['songs'] = it.songs
			return returnArray
		}
	}
	def destroy = {
	}
}
