package com.isdenmois.bookuploader.data.parsers

import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType
import io.mockk.mockk
import org.junit.Assert.assertEquals
import org.junit.Test

class FlibustaParserTest {
    private val config = mockk<AppConfig>(relaxed = true)
    private val parser = FlibustaParser(config)

    @Test
    fun shouldParseData() {
        val body = """<entry>
          <link href="/1.fb2"></link>
          <author>
            <name>J. K. Rowling</name>
          </author>
          <title>Harry Potter and the Philosopher's Stone</title>
          <link href="/i/82/605182/cover.jpg" rel="http://opds-spec.org/image" type="image/jpeg" />
        </entry>
        <entry>
          <link href="/2.fb2"></link>
          <author>
            <name>J. K. Rowling</name>
          </author>
          <title>Гарри Поттер и тайная комната</title>
          <content>Перевод: Росмун&Язык: Русский& Размер: 1Мб  &</content>
        </entry>
        <entry>
          <author>
            <name>J. K. Rowling</name>
          </author>
        </entry>"""

        val books = parser.parse(body)

        assertEquals(2, books.size)
        assertEquals(
            listOf(
                Book(
                    id = "/1.fb2",
                    link = "/1.fb2",
                    type = ProviderType.FLIBUSTA,
                    title = "Harry Potter and the Philosopher's Stone",
                    authors = "J. K. Rowling",
                    ext = "fb2.zip",
                ),
                Book(
                    id = "/2.fb2",
                    link = "/2.fb2",
                    type = ProviderType.FLIBUSTA,
                    title = "Гарри Поттер и тайная комната",
                    authors = "J. K. Rowling",
                    ext = "fb2.zip",
                    language = "Русский",
                    translation = "Росмун",
                    size = "1Мб",
                ),
            ),
            books
        )
    }
}
