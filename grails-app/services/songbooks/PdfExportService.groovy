package songbooks

import com.itextpdf.text.Document
import com.itextpdf.text.Element
import com.itextpdf.text.PageSize
import com.itextpdf.text.Paragraph
import com.itextpdf.text.pdf.PdfWriter

class PdfExportService {

    def exportSong(Song song, OutputStream target) {
		Document document = new Document();
		PdfWriter.getInstance(document, target);

		document.setPageSize(PageSize.A5);
        document.setMargins(50, 30, 30, 30);
		document.setMarginMirroring(true);

		document.open();
		exportSong(song, document)
		document.close();
    }

    def exportSongbook(Songbook songbook, OutputStream target) {

    }
	
	def exportSong(Song song, Document document) {
        document.add(new Paragraph(
            "The left margin of this odd page is 36pt (0.5 inch); " +
            "the right margin 72pt (1 inch); " +
            "the top margin 108pt (1.5 inch); " +
            "the bottom margin 180pt (2.5 inch)."));
        Paragraph paragraph = new Paragraph();
        paragraph.setAlignment(Element.ALIGN_JUSTIFIED);
        for (int i = 0; i < 50; i++) {
            paragraph.add("Hello World! Hello People! " +
                "Hello Sky! Hello Sun! Hello Moon! Hello Stars!");
        }
        document.add(paragraph);
        document.add(new Paragraph("The top margin 180pt (2.5 inch)."));
	}
}
