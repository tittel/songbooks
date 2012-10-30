package songbooks

import java.util.zip.ZipInputStream

class ImportController {
	def index() {
	}
		
	def result() {
		def importedSongs = []
		// handle uploaded file depending on type
		def uploadedFile = request.getFile('payload')
		if ("application/zip" == uploadedFile.contentType) {
			def stream = new ZipInputStream(uploadedFile.inputStream)
			def zipentry = stream.getNextEntry();
			def buf = new byte[1024];
            while (zipentry != null) { 
                if (zipentry.getName().toLowerCase().endsWith(".chopro")) {
					def read;
					def text = ""
					while ((read = stream.read(buf)) > -1) {
						text += new String(buf, 0, read, "UTF-8");
					}
					try {
						importedSongs << importSong(text)
					}
					catch(e) {
						log.warn e
					}
                }
                zipentry = stream.getNextEntry();
            }
		}
		else {
			try {
				Song song = new Song()
				song.text = uploadedFile.inputStream.text
				song.save(flush:true)
				importedSongs << song
			}
			catch(e) {
				log.warn e
			}
		}
		[importedSongs:importedSongs]
	}
}
