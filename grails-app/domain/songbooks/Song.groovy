package songbooks

class Song {
	static hasMany = [songbooks:Songbook]
	static belongsTo = Songbook
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
	static transients = ["name", "author"]
	
	String text
	String name
	String author
	Date dateCreated
	Date lastUpdated
	
	public void setText(String text) {
		name = (text =~ "\\{(t|title):(.*?)\\}")[0][2]
		author = (text =~ "\\{(st|subtitle):(.*?)\\}")[0][2]
		this.text = text
	}
}
