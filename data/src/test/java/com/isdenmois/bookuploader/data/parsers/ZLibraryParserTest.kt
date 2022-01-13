package com.isdenmois.bookuploader.data.parsers

import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.data.remote.TorApi
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType
import io.mockk.mockk
import org.junit.Assert.*
import org.junit.Test

class ZLibraryParserTest {
    private val config = mockk<AppConfig>(relaxed = true)
    private val api = mockk<TorApi>()
    private val preferences = mockk<AppPreferences>(relaxed = true)
    private val parser = ZLibraryParser(config = config, torApi = api, preferences = preferences)

    @Test
    fun shouldParseData() {
        val body = """<body>
        <div id="searchResultBox">
          <div class="resItemBox">
            <div class="itemCover">
              <img class="cover" data-src="/hp.jpg" />
            </div>
            <h3 itemprop="name">
              <a href="/hp3.epub">
                Harry Potter and the Prisoner of Azkaban
              </a>
            </h3>
            <div class="authors">
              <a>J. K. Rowling</a>
              <a>Someone else</a>
            </div>
            <div class="property__file">
              <div class="property_value">EPUB, 10Mb</div>
            </div>
            <div class="property_language">
              Language: English
            </div>
          </div>
        </div>
      </body>"""

        val books = parser.parse(body)

        assertEquals(1, books.size)
        assertEquals(
            listOf(
                Book(
                    id = "/hp3.epub",
                    link = "/hp3.epub",
                    type = ProviderType.ZLIBRARY,
                    title = "Harry Potter and the Prisoner of Azkaban",
                    authors = "J. K. Rowling; Someone else",
                    ext = "EPUB",
                    language = "English",
                    size = "10Mb",
                ),
            ),
            books
        )
    }
}
