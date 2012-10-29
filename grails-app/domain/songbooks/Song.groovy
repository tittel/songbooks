package songbooks

class Song {
	static searchable = {
		name boost:2.0
		author boost:2.0
	}
	static constraints = {
		name blank:false
		author blank:false
		text blank:false
	}
	static mapping = {
		text type:"text"
	}

	String name
	String author
	String text
	Date dateCreated
	Date lastUpdated
	
	static Song parse(text, safe=false) throws Exception {
		def name = ""
		def author = ""
		try {
			name = (text =~ "\\{(t|title):(.*?)\\}")[0][2]
			author = (text =~ "\\{(st|subtitle):(.*?)\\}")[0][2]
		}
		catch(e) {
			if (!safe) {
				throw e
			}
		}
		return new Song(name:name, author:author, text:text)
	}
}
