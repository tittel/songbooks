package songbooks

class Song {
	static hasMany = [songbooks: Songbook]
	static searchable = {
		name boost:2.0
		author boost:2.0
		only:["name", "author", "text"]
		//text analyzer:"songTextAnalyzer"
		//containedInSongbook index:"no"
		//songbooks component:true
	}
	static constraints = {
		name blank:false
		author blank:false
		text blank:false
	}
	static mapping = {
		text type:"text"
	}
	static transients = ["containedInSongbook", "name", "author"]

	String name
	String author
	String text
	boolean containedInSongbook
	Date dateCreated
	Date lastUpdated
	
	public void setText(String text) {
		name = (text =~ "\\{(t|title):(.*?)\\}")[0][2]
		author = (text =~ "\\{(st|subtitle):(.*?)\\}")[0][2]
		this.text = text
	}
}
