package songbooks

class Songbook {
	static searchable = {
		only : ["id"]
	}
	static hasMany = [songs:Song]
	static constraints = {
		name blank:false
		author blank:false
	}

	String name
	String author
	String props
	Date dateCreated
	Date lastUpdated
}
