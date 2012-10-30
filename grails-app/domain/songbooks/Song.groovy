package songbooks

class Song {
	static searchable = {
		name boost:2.0
		author boost:2.0
		//text analyzer:"songTextAnalyzer"
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
	
	public void setText(String text) {
		name = (text =~ "\\{(t|title):(.*?)\\}")[0][2]
		author = (text =~ "\\{(st|subtitle):(.*?)\\}")[0][2]
		this.text = text
	}
}
