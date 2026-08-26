package com.isdenmois.bookuploader.zlibrary.client

import com.isdenmois.bookuploader.zlibrary.api.ZlibApi
import com.isdenmois.bookuploader.zlibrary.const.Extension
import com.isdenmois.bookuploader.zlibrary.const.Language
import com.isdenmois.bookuploader.zlibrary.exception.EmptyQueryException
import com.isdenmois.bookuploader.zlibrary.exception.LoginFailedException
import com.isdenmois.bookuploader.zlibrary.exception.NotLoggedInException
import com.isdenmois.bookuploader.zlibrary.model.BooklistBooksResponse
import com.isdenmois.bookuploader.zlibrary.model.LoginResponse
import com.isdenmois.bookuploader.zlibrary.parser.BookDetailParser
import com.isdenmois.bookuploader.zlibrary.parser.DownloadsPageParser
import com.isdenmois.bookuploader.zlibrary.parser.LimitsPageParser
import com.isdenmois.bookuploader.zlibrary.parser.SearchPageParser
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import okhttp3.Headers
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertThrows
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import retrofit2.Response

class ZlibClientTest {
    private val api: ZlibApi = mockk()
    private lateinit var client: ZlibClient

    @Before
    fun setUp() {
        val moshi = Moshi.Builder().addLast(KotlinJsonAdapterFactory()).build()
        client = ZlibClient(
            api = api,
            searchPageParser = SearchPageParser(),
            bookDetailParser = BookDetailParser(),
            downloadsPageParser = DownloadsPageParser(),
            limitsPageParser = LimitsPageParser(),
            booklistBooksAdapter = moshi.adapter(BooklistBooksResponse::class.java),
            loginResponseAdapter = moshi.adapter(LoginResponse::class.java),
            mirror = "https://z-library.sk",
        )
    }

    @Test
    fun `login sends rpc payload and stores session cookies`() = runBlocking {
        mockkLoginResponse()

        client.login("email@example.com", "s3cret")

        coVerify {
            api.login(
                mapOf(
                    "isModal" to "true",
                    "email" to "email@example.com",
                    "password" to "s3cret",
                    "site_mode" to "books",
                    "action" to "login",
                    "isSingleLogin" to "1",
                    "redirectUrl" to "",
                    "gg_json_mode" to "1",
                ),
            )
        }
        assertTrue(client.isLoggedIn)
    }

    @Test
    fun `login failure raises LoginFailedException`() = runBlocking {
        val body = """{"response":{"validationError":"Wrong email or password"}}"""
        mockkLoginResponse(body)

        assertThrows(LoginFailedException::class.java) {
            runBlocking { client.login("bad@example.com", "wrong") }
        }
        assertTrue(!client.isLoggedIn)
    }

    @Test
    fun `login without session cookies raises LoginFailedException`() = runBlocking {
        every { api.login(any()) } returns Response.success("""{"response":{}}""")
        assertThrows(LoginFailedException::class.java) {
            runBlocking { client.login("bad@example.com", "wrong") }
        }
    }

    @Test
    fun `search requires login`() = runBlocking {
        assertThrows(NotLoggedInException::class.java) {
            runBlocking { client.search("harry potter") }
        }
    }

    @Test
    fun `search rejects empty query`() = runBlocking {
        mockkLoginResponse()
        client.login("a@b.c", "p")

        assertThrows(EmptyQueryException::class.java) {
            runBlocking { client.search("") }
        }
    }

    @Test
    fun `search passes filters and cookie header`() = runBlocking {
        mockkLoginResponse()
        client.login("a@b.c", "p")

        val body = """
            <html><body>
            <div id="searchResultBox">
              <div class="book-item">
                <z-bookcard id="1" href="/book/1/a" extension="EPUB"><img data-src="x"></img><div slot="title">B</div></z-bookcard>
              </div>
            </div>
            <script>var pagerOptions = { pagesTotal: 3 };</script>
            </body></html>
        """.trimIndent()
        coEvery { api.search(any(), any(), any(), any(), any(), any(), any(), any()) } returns body

        val page = client.search(
            query = "harry potter",
            exact = true,
            fromYear = 2000,
            toYear = 2010,
            languages = listOf(Language.ENGLISH, Language.RUSSIAN),
            extensions = listOf(Extension.EPUB),
            count = 25,
        )

        coVerify {
            api.search(
                query = "harry+potter",
                exact = 1,
                fromYear = 2000,
                toYear = 2010,
                languages = listOf("english", "russian"),
                extensions = listOf("EPUB"),
                page = 1,
                cookie = "remix_userkey=key123; remix_userid=user456",
            )
        }
        assertEquals(3, page.totalPages)
        assertEquals(1, page.results.size)
    }

    @Test
    fun `fullTextSearch requires phrase or words`() = runBlocking {
        mockkLoginResponse()
        client.login("a@b.c", "p")

        assertThrows(IllegalArgumentException::class.java) {
            runBlocking { client.fullTextSearch("harry potter") }
        }
    }

    @Test
    fun `fullTextSearch phrase requires two words`() = runBlocking {
        mockkLoginResponse()
        client.login("a@b.c", "p")

        assertThrows(IllegalArgumentException::class.java) {
            runBlocking { client.fullTextSearch("harry", phrase = true) }
        }
    }

    @Test
    fun `cookie restore and serialize round trip without network`() {
        assertFalse(client.isLoggedIn)
        assertEquals("", client.serializeCookies())

        client.restoreCookies("remix_userkey=key123; remix_userid=user456")

        assertTrue(client.isLoggedIn)
        assertEquals("remix_userkey=key123; remix_userid=user456", client.serializeCookies())

        client.logout()

        assertFalse(client.isLoggedIn)
        assertEquals("", client.serializeCookies())
    }

    @Test
    fun `restoreCookies with blank header leaves client logged out`() {
        client.restoreCookies(null)
        assertFalse(client.isLoggedIn)

        client.restoreCookies("   ")
        assertFalse(client.isLoggedIn)
    }

    private fun mockkLoginResponse(body: String = """{"response":{}}""") {
        val headers = Headers.Builder()
            .add("Set-Cookie", "remix_userkey=key123; Path=/; Max-Age=31536000")
            .add("Set-Cookie", "remix_userid=user456; Path=/; Max-Age=31536000")
            .build()
        every { api.login(any()) } returns Response.success(body, headers)
    }
}
