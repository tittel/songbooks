package songbooks

class SongTagLib {
	static namespace = "song"
	
	def render = { attrs, body ->
		def text = attrs.text
		def markup = "<h1>huhu</h1>"
		markup += text
		out << markup
	}
	
	def chord = { attrs, body ->
		println "CREATING CHORD FROM -> attrs=" + attrs + ", body=" + body()
		out << ("huh".bytes as byte[])
	}
}
