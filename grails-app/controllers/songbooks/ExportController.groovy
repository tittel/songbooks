package songbooks

import grails.converters.XML

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class ExportController {
	def index() {
		new Songbook(name:"Songbook von Stephan", author:"Stephan").save()
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
}
