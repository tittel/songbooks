package songbooks

class Songbook {
	static searchable = {
		only : ["id"]
	}
	static hasMany = [songs:Song]
	static constraints = {
		name blank:false
		author blank:false
		format blank:false
	}

	String name
	String author
	String format = "A5"
	Date dateCreated
	Date lastUpdated
}
