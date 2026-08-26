package com.isdenmois.bookuploader.zlibrary.parser

import com.isdenmois.bookuploader.zlibrary.exception.ParseException
import com.isdenmois.bookuploader.zlibrary.model.DownloadLimits
import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class LimitsPageParserTest {
    private val parser = LimitsPageParser()

    @Test
    fun `parses limits from d-count and d-reset`() {
        val body = """
            <html><body>
            <div class="dstats-info">
              <div class="d-count">7/10</div>
              <div class="d-reset">in 3 hours</div>
            </div>
            </body></html>
        """.trimIndent()

        val limits = parser.parse(body)

        assertEquals(
            DownloadLimits(
                dailyAmount = 7,
                dailyAllowed = 10,
                dailyRemaining = 3,
                dailyReset = "in 3 hours",
            ),
            limits,
        )
    }

    @Test
    fun `returns empty reset when d-reset missing`() {
        val body = """
            <html><body>
            <div class="dstats-info">
              <div class="d-count">7/10</div>
            </div>
            </body></html>
        """.trimIndent()

        val limits = parser.parse(body)

        assertEquals(3, limits.dailyRemaining)
        assertEquals("", limits.dailyReset)
    }

    @Test
    fun `throws ParseException when stats box missing`() {
        assertThrows(ParseException::class.java) {
            parser.parse("<html><body></body></html>")
        }
    }
}
