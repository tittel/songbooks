package songbooks

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class ExportController {
	def index() {
		response.setHeader("Content-Type", "application/zip")
		response.setHeader("Content-disposition", "attachment;filename=songbooks-export-${formatDate(format:'yyMMdd')}.zip")
		new ZipOutputStream(response.outputStream).withStream { zipOutputStream ->
			Song.list().each { song ->
				zipOutputStream.putNextEntry(new ZipEntry("songs/sbid_${song.id}.chopro"))
				zipOutputStream << song.text
			}
		}
	}
}
