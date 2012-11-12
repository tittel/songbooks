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
		exportData lazy:true, maxSize:10000000
	}

	String name
	String author
	String format = "A5"
	Date dateCreated
	Date lastUpdated
	
	/**
	 * 0 = not existing
	 * 1 = in progress
	 * 2 = existing
	 */
	Integer exportState = 0
	byte[] exportData = new byte[0]
}
