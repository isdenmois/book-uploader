package com.isdenmois.bookuploader.zlibrary.parser

import com.isdenmois.bookuploader.zlibrary.exception.ParseException
import com.isdenmois.bookuploader.zlibrary.model.BookDetail
import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class BookDetailParserTest {
    private val parser = BookDetailParser()
    private val mirror = "https://z-library.sk"

    @Test
    fun `parses full book detail`() {
        val body = """
            <html>
            <body>
            <div class="row cardBooks">
              <div class="col-sm-9">
                <a href="/author/lev-tolstoj">Лев Толстой</a>
              </div>
              <div id="bookDescriptionBox">Великий роман о войне.</div>
              <div class="bookDetailsBox">
                <div class="property_year"><div class="property_value">1869</div></div>
                <div class="property_edition"><div class="property_value">1st</div></div>
                <div class="property_publisher"><div class="property_value">Азбука</div></div>
                <div class="property_language"><div class="property_value">russian</div></div>
                <div class="property_isbn">
                  <div class="property_label">isbn13:</div>
                  <div class="property_value">978-5-17-0</div>
                </div>
                <div class="property_isbn">
                  <div class="property_label">isbn10:</div>
                  <div class="property_value">5-17-0</div>
                </div>
                <div class="property_categories">
                  <div class="property_value"><a href="/categories/prose">Проза</a> · Классика</div>
                </div>
                <div class="property__file">EPUB\n1.23 MB</div>
              </div>
              <div class="book-rating"> 5.0 / 5.0 </div>
            </div>
            <z-cover title="Война и мир">
              <img class="image" src="https://cdn.example/cover.jpg">
            </z-cover>
            <a class="btn btn-default addDownloadedBook" href="/dl/5393918/abc">Download</a>
            </body>
            </html>
        """.trimIndent()

        val detail = parser.parse(body, "https://z-library.sk/book/5393918/a28f0c", mirror)

        assertEquals(
            BookDetail(
                url = "https://z-library.sk/book/5393918/a28f0c",
                name = "Война и мир",
                cover = "https://cdn.example/cover.jpg",
                authors = listOf(BookDetail.Author("Лев Толстой", "https://z-library.sk/author/lev-tolstoj")),
                description = "Великий роман о войне.",
                year = "1869",
                edition = "1st",
                publisher = "Азбука",
                language = "russian",
                isbn = mapOf("isbn13" to "978-5-17-0", "isbn10" to "5-17-0"),
                categories = "Проза · Классика",
                categoriesUrl = "https://z-library.sk/categories/prose",
                extension = "EPUB",
                size = "1.23 MB",
                rating = "5.0/5.0",
                downloadUrl = "https://z-library.sk/dl/5393918/abc",
            ),
            detail,
        )
    }

    @Test
    fun `marks download as unavailable when text says so`() {
        val body = """
            <html><body>
            <div class="row cardBooks">
              <z-cover title="Book"><img class="image" src="x"></z-cover>
              <div class="bookDetailsBox"></div>
            </div>
            <a class="btn btn-default addDownloadedBook" href="#">Unavailable</a>
            </body></html>
        """.trimIndent()

        val detail = parser.parse(body, "https://z-library.sk/book/1/a", mirror)

        assertEquals(BookDetailParser.UNAVAILABLE_DOWNLOAD, detail.downloadUrl)
    }

    @Test
    fun `throws ParseException when cardBooks root missing`() {
        assertThrows(ParseException::class.java) {
            parser.parse("<html><body><p>nope</p></body></html>", "https://z-library.sk/book/1/a", mirror)
        }
    }

    @Test
    fun `throws ParseException when z-cover missing`() {
        val body = """
            <html><body>
            <div class="row cardBooks"><div class="bookDetailsBox"></div></div>
            </body></html>
        """.trimIndent()

        assertThrows(ParseException::class.java) {
            parser.parse(body, "https://z-library.sk/book/1/a", mirror)
        }
    }
}
