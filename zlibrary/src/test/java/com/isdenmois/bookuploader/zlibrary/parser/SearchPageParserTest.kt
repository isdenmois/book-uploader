package com.isdenmois.bookuploader.zlibrary.parser

import com.isdenmois.bookuploader.zlibrary.exception.ParseException
import com.isdenmois.bookuploader.zlibrary.model.BookSummary
import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class SearchPageParserTest {
    private val parser = SearchPageParser()
    private val mirror = "https://z-library.sk"

    @Test
    fun `parses book cards from search results`() {
        val body = """
            <html>
            <body>
            <div id="searchResultBox">
              <div class="book-item">
                <z-bookcard id="5393918" isbn="978-5-17-0" href="/book/5393918/a28f0c"
                            publisher="AST" year="2021" language="russian"
                            extension="EPUB" filesize=" 23.46 MB" rating="5.0/5.0" quality="high">
                  <img data-src="https://cdn.example/cover1.jpg">
                    <img data-src="https://cdn.example/cover1-small.jpg">
                  </img>
                  <div slot="author">Лев Толстой; А. Чехов</div>
                  <div slot="title">Война и мир</div>
                </z-bookcard>
              </div>
              <div class="book-item">
                <z-bookcard id="42" href="/book/42/abc" extension="FB2">
                  <img data-src="https://cdn.example/cover2.jpg"></img>
                  <div slot="author">Some Author</div>
                  <div slot="title">Another Book</div>
                </z-bookcard>
              </div>
              <div class="book-item">
                <z-bookcard id="43" href="/book/43/def">
                  <div slot="author">No Cover Author</div>
                  <div slot="title">No Cover</div>
                </z-bookcard>
              </div>
            </div>
            </body>
            </html>
        """.trimIndent()

        val page = parser.parse(body, mirror)

        assertEquals(2, page.results.size)
        assertEquals(
            BookSummary(
                id = "5393918",
                isbn = "978-5-17-0",
                url = "https://z-library.sk/book/5393918/a28f0c",
                cover = "https://cdn.example/cover1-small.jpg",
                publisher = "AST",
                authors = listOf("Лев Толстой", "А. Чехов"),
                name = "Война и мир",
                year = "2021",
                language = "russian",
                extension = "EPUB",
                size = "23.46 MB",
                rating = "5.0/5.0",
                quality = "high",
            ),
            page.results[0],
        )
        assertEquals("Another Book", page.results[1].name)
    }

    @Test
    fun `parses total pages from pagerOptions script`() {
        val body = """
            <html>
            <body>
            <div id="searchResultBox">
              <div class="book-item">
                <z-bookcard href="/book/1/a"><img data-src="x"></img><div slot="title">B</div></z-bookcard>
              </div>
            </div>
            <script>var pagerOptions = { currentPage: 1, pagesTotal: 7, pageSize: 10 };</script>
            <script>var another = 1;</script>
            </body>
            </html>
        """.trimIndent()

        val page = parser.parse(body, mirror)

        assertEquals(7, page.totalPages)
        assertEquals(1, page.results.size)
    }

    @Test
    fun `returns empty results when notFound is present`() {
        val body = """
            <html><body>
            <div id="searchResultBox">
              <div class="notFound">Nothing found</div>
            </div>
            </body></html>
        """.trimIndent()

        val page = parser.parse(body, mirror)

        assertEquals(0, page.results.size)
    }

    @Test
    fun `throws ParseException when result box is missing`() {
        assertThrows(ParseException::class.java) {
            parser.parse("<html><body><p>error</p></body></html>", mirror)
        }
    }

    @Test
    fun `throws ParseException when no book items`() {
        val body = """
            <html><body>
            <div id="searchResultBox"></div>
            </body></html>
        """.trimIndent()

        assertThrows(ParseException::class.java) {
            parser.parse(body, mirror)
        }
    }
}
