package songbooks

class Song implements Serializable {
	static searchable = true
	static constraints = {
		name blank:false
		author blank:false
		text blank:false
	}
	static mapping = {
		id composite: ["name", "author"]
	}

	String name
	String author
	String text
	Date dateCreated
	Date lastUpdated
	
	static Song parse(text) {
		def name = (text =~ "\\{(t|title):(.*?)\\}")[0][2]
		def author = (text =~ "\\{(st|subtitle):(.*?)\\}")[0][2]
		return new Song(name:name, author:author, text:text)
	}
}
