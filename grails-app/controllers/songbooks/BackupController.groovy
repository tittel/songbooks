package songbooks

import grails.converters.XML

import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream


class BackupController {
	def index() {
		render(view:"import")
	}

	def importBackup() {
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
				importedSongs << importSong(uploadedFile.inputStream.text)
			}
			catch(e) {
				log.warn e
			}
		}
		render(view:"import-result", model:[importedSongs:importedSongs])
	}
	
	def exportBackup() {
		response.setHeader("Content-Type", "application/zip")
		response.setHeader("Content-disposition", "attachment;filename=songbooks-export-${formatDate(format:'yyMMdd-HHmm')}.zip")
		new ZipOutputStream(response.outputStream).withStream { zipOutputStream ->
			Song.list().each { song ->
				zipOutputStream.putNextEntry(new ZipEntry("songs/sbid_${song.id}.chopro"))
				zipOutputStream << song.text
			}
			Songbook.list().each { songbook ->
				zipOutputStream.putNextEntry(new ZipEntry("songbooks/sbid_${songbook.id}.xml"))
				zipOutputStream << (songbook as XML).toString()
			}
		}
	}
	
	def importSong(text) {
		Song song = new Song()
		song.text = text
		return song.save(flush:true)
	}
}
