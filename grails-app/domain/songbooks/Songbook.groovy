package songbooks

class Songbook implements Serializable {
	static hasMany = [songs: Song]
	static constraints = {
		name blank:false
		author blank:false
	}
	static mapping = {
		id composite: ["name", "author"]
	}

	String name
	String author
	Date dateCreated
	Date lastUpdated
}
