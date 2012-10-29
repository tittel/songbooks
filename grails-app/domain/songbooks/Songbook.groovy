package songbooks

class Songbook {
	static hasMany = [songs: Song]
	static constraints = {
		name blank:false
		author blank:false
	}

	String name
	String author
	Date dateCreated
	Date lastUpdated
}
