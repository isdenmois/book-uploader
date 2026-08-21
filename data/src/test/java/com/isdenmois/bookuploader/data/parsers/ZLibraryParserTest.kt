package com.isdenmois.bookuploader.data.parsers

import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.data.remote.TorApi
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import io.mockk.mockk
import org.junit.Assert.assertEquals
import org.junit.Test

class ZLibraryParserTest {
    private val config = mockk<AppConfig>(relaxed = true)
    private val api = mockk<TorApi>()
    private val preferences = mockk<AppPreferences>(relaxed = true)
    private val parser = ZLibraryParser(
        config = config,
        torApi = api,
        preferences = preferences,
        moshi = Moshi.Builder().addLast(KotlinJsonAdapterFactory()).build(),
    )

    @Test
    fun shouldParseData() {
        val body = """
            {
              "success": 1,
              "books": [
                {
                  "id": "123",
                  "hash": "abc",
                  "title": "Harry Potter and the Prisoner of Azkaban",
                  "extension": "epub",
                  "author": "J. K. Rowling",
                  "language": "English",
                  "filesizeString": "10Mb",
                  "dl": ""
                }
              ]
            }
        """.trimIndent()

        val books = parser.parseBody(body, extension = null)

        assertEquals(1, books.size)
        assertEquals(
            listOf(
                Book(
                    id = "123",
                    link = "/eapi/book/123/abc/file",
                    type = ProviderType.ZLIBRARY,
                    title = "Harry Potter and the Prisoner of Azkaban",
                    authors = "J. K. Rowling",
                    ext = "epub",
                    language = "English",
                    size = "10Mb",
                ),
            ),
            books
        )
    }
}
