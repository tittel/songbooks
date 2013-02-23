package songbooks

import grails.converters.XML

import java.text.SimpleDateFormat
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream


class BackupController {
	def index() {
		render(view:"import")
	}

	def importBackup() {
		if (params.replace) {
			Song.list()*.delete()
			Songbook.list()*.delete()
		}
		def songIdMapping = [:]
		def importedSongs = []
		def importedSongbooks = []
		// handle uploaded file depending on type
		def uploadedFile = request.getFile('payload')
		if ("application/zip" == uploadedFile.contentType) {
			def zipentry
			def buf = new byte[1024];
			// import songs
			def stream = new ZipInputStream(uploadedFile.inputStream)
            while ((zipentry = stream.getNextEntry()) != null) { 
                if (zipentry.getName().toLowerCase().endsWith(".chopro")) {
					def read;
					def text = ""
					while ((read = stream.read(buf)) > -1) {
						text += new String(buf, 0, read, "UTF-8");
					}
					try {
						importedSongs << importSong(text, zipentry.getName(), songIdMapping)
					}
					catch(e) {
						log.warn e
					}
                }
            }
			stream.close()
			// import songbooks
			stream = new ZipInputStream(uploadedFile.inputStream)
            while ((zipentry = stream.getNextEntry()) != null) { 
                if (zipentry.getName().toLowerCase().endsWith(".xml")) {
					def read;
					def text = ""
					while ((read = stream.read(buf)) > -1) {
						text += new String(buf, 0, read, "UTF-8");
					}
					try {
						importedSongbooks << importSongbook(text, songIdMapping)
					}
					catch(e) {
						log.warn e
					}
                }
            }
			stream.close()
		}
		else {
			try {
				importedSongs << importSong(uploadedFile.inputStream.text)
			}
			catch(e) {
				log.warn e
			}
		}
		render(view:"import-result", model:[importedSongs:importedSongs, importedSongbooks:importedSongbooks])
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
	
	def importSong(text, filename, songIdMapping) {
		Song song = new Song()
		song.text = text
		song.save(flush:true)
		if (filename && songIdMapping != null) {
			def matcher = (filename =~ /.*\/sbid_([0-9]+)\.chopro/)
			if (matcher.matches()) {
				def oldId = matcher[0][1]
				songIdMapping[oldId] = song.id
			}
		}
		return song
	}
	
	def importSongbook(text, songIdMapping) {
		def xml = new XmlParser().parseText(text)
		
		Songbook songbook = new Songbook()
		songbook.name = xml.name.text()
		songbook.author = xml.author.text()
		songbook.format = xml.format.text()
		xml.songs?.song?.each {
			def newId = songIdMapping[it."@id"]
			if (newId) {
				songbook.addToSongs(Song.get(newId))
			}
		}
		songbook.save(flush:true)
		songbook.dateCreated = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SS Z").parse(xml.dateCreated.text())
		return songbook.save(flush:true)
	}
}
