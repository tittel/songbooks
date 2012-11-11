package songbooks

class Songbook {
	static searchable = {
		only : ["id"]
	}
	static hasMany = [songs:Song]
//	static hasOne = [export:SongbookExport]
	static constraints = {
		name blank:false
		author blank:false
		format blank:false
		exportData lazy:true
	}

	String name
	String author
	String format = "A5"
	Date dateCreated
	Date lastUpdated
	
	byte[] exportData = new byte[0]
	String exportMimeType = "text/pdf"
	/**
	 * 0 = not existing
	 * 1 = in progress
	 * 2 = existing
	 */
	Integer exportState = 0
}
