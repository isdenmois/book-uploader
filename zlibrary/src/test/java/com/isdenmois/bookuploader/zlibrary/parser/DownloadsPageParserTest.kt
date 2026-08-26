package com.isdenmois.bookuploader.zlibrary.parser

import com.isdenmois.bookuploader.zlibrary.exception.ParseException
import com.isdenmois.bookuploader.zlibrary.model.DownloadRecord
import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class DownloadsPageParserTest {
    private val parser = DownloadsPageParser()
    private val mirror = "https://z-library.sk"

    @Test
    fun `parses download history rows`() {
        val body = """
            <html><body>
            <div class="dstats-content">
              <table>
                <tr class="dstats-row">
                  <td class="lg-w-120">2024-01-15</td>
                  <td><div class="book-title">Война и мир</div></td>
                  <td><a href="/book/1/a">link</a></td>
                </tr>
                <tr class="dstats-row">
                  <td class="lg-w-120">2024-01-16</td>
                  <td><div class="book-title">Анна Каренина</div></td>
                  <td><a href="/book/2/b">link</a></td>
                </tr>
              </table>
            </div>
            </body></html>
        """.trimIndent()

        val records = parser.parse(body, mirror)

        assertEquals(
            listOf(
                DownloadRecord(name = "Война и мир", date = "2024-01-15", url = "https://z-library.sk/book/1/a"),
                DownloadRecord(name = "Анна Каренина", date = "2024-01-16", url = "https://z-library.sk/book/2/b"),
            ),
            records,
        )
    }

    @Test
    fun `returns empty list when downloads not found`() {
        val body = """
            <html><body>
            <div class="dstats-content">
              <p>Downloads not found</p>
            </div>
            </body></html>
        """.trimIndent()

        assertEquals(0, parser.parse(body, mirror).size)
    }

    @Test
    fun `throws ParseException when content box missing`() {
        assertThrows(ParseException::class.java) {
            parser.parse("<html><body></body></html>", mirror)
        }
    }
}
