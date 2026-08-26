package com.isdenmois.bookuploader.zlibrary.client

import com.isdenmois.bookuploader.zlibrary.api.ZlibApi
import com.isdenmois.bookuploader.zlibrary.const.Extension
import com.isdenmois.bookuploader.zlibrary.const.Language
import com.isdenmois.bookuploader.zlibrary.exception.EmptyQueryException
import com.isdenmois.bookuploader.zlibrary.exception.LoginFailedException
import com.isdenmois.bookuploader.zlibrary.exception.NoIdException
import com.isdenmois.bookuploader.zlibrary.exception.NotLoggedInException
import com.isdenmois.bookuploader.zlibrary.model.BookDetail
import com.isdenmois.bookuploader.zlibrary.model.BookSummary
import com.isdenmois.bookuploader.zlibrary.model.BooklistBooksResponse
import com.isdenmois.bookuploader.zlibrary.model.DownloadLimits
import com.isdenmois.bookuploader.zlibrary.model.DownloadRecord
import com.isdenmois.bookuploader.zlibrary.model.LoginResponse
import com.isdenmois.bookuploader.zlibrary.parser.BookDetailParser
import com.isdenmois.bookuploader.zlibrary.parser.DownloadsPageParser
import com.isdenmois.bookuploader.zlibrary.parser.LimitsPageParser
import com.isdenmois.bookuploader.zlibrary.parser.SearchPageParser
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import java.net.URLEncoder
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.inject.Inject
import javax.inject.Named
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.ResponseBody

/**
 * Kotlin port of the Python `AsyncZlib` client.
 *
 * Holds the auth cookies captured from the `rpc.php` login and sends them on
 * every subsequent request via the `cookie` header, exactly like the Python
 * library. Not thread-confined: `login`/`logout` are expected to run before
 * concurrent reads in practice.
 */
@Singleton
class ZlibClient @Inject constructor(
    private val api: ZlibApi,
    private val searchPageParser: SearchPageParser,
    private val bookDetailParser: BookDetailParser,
    private val downloadsPageParser: DownloadsPageParser,
    private val limitsPageParser: LimitsPageParser,
    private val booklistBooksAdapter: JsonAdapter<BooklistBooksResponse>,
    private val loginResponseAdapter: JsonAdapter<LoginResponse>,
    @Named("zlibMirror") val mirror: String,
) {
    data class SearchPage(
        val results: List<BookSummary>,
        val totalPages: Int,
    )

    private val cookies = mutableMapOf<String, String>()
    private val cookieHeader: String?
        get() = if (cookies.isEmpty()) null else cookies.entries.joinToString("; ") { (k, v) -> "$k=$v" }

    private var loggedIn = false

    /**
     * Logs in via `rpc.php` and stores the session cookies
     * (`remix_userkey` / `remix_userid`). Returns a [ZlibProfile] handle.
     */
    suspend fun login(email: String, password: String): ZlibProfile = withContext(Dispatchers.IO) {
        val response = api.login(
            data = mapOf(
                "isModal" to "true",
                "email" to email,
                "password" to password,
                "site_mode" to "books",
                "action" to "login",
                "isSingleLogin" to "1",
                "redirectUrl" to "",
                "gg_json_mode" to "1",
            ),
        )

        val body = response.body() ?: throw LoginFailedException("Empty login response")

        val loginResponse = loginResponseAdapter.fromJson(body)
        if (loginResponse?.response?.validationError != null) {
            throw LoginFailedException(loginResponse.response.validationError)
        }

        val newCookies = response.headers().toMultimap()
            .getOrDefault("set-cookie", emptyList())
            .mapNotNull { cookieLine ->
                val (key, value) = cookieLine.substringBefore(';').split('=', limit = 2)
                if (key.isBlank()) null else key to value
            }
            .toMap()

        if (newCookies.isEmpty()) {
            throw LoginFailedException("No session cookies returned")
        }

        cookies.putAll(newCookies)
        loggedIn = true
        ZlibProfile(client = this@ZlibClient, mirror = mirror)
    }

    /** Clears the session cookies (client-side only, like the Python `logout`). */
    fun logout() {
        cookies.clear()
        loggedIn = false
    }

    /** Serializes the current session cookies into a single header string (`k=v; k2=v2`). */
    fun serializeCookies(): String = cookieHeader ?: ""

    /**
     * Restores a session from a serialized cookie header (as produced by [serializeCookies]),
     * without hitting the network. The client counts as logged in when at least one cookie is
     * present; if the server-side session has since expired, requests will fail upstream
     * and the user must re-login.
     */
    fun restoreCookies(cookieHeader: String?) {
        cookies.clear()
        loggedIn = false

        cookieHeader?.split(";")?.forEach { entry ->
            val pair = entry.trim().split('=', limit = 2)
            if (pair.size == 2 && pair[0].isNotBlank()) {
                cookies[pair[0].trim()] = pair[1].trim()
            }
        }

        if (cookies.isNotEmpty()) {
            loggedIn = true
        }
    }

    val isLoggedIn: Boolean
        get() = loggedIn

    /**
     * Search with the same query params as the Python `AsyncZlib.search`.
     */
    suspend fun search(
        query: String,
        exact: Boolean = false,
        fromYear: Int? = null,
        toYear: Int? = null,
        languages: List<Language> = emptyList(),
        extensions: List<Extension> = emptyList(),
        count: Int = 10,
    ): SearchPage = searchImpl(
        fullText = false,
        query = query,
        exact = exact,
        fromYear = fromYear,
        toYear = toYear,
        languages = languages,
        extensions = extensions,
        count = count,
    )

    /**
     * Full-text search. Mirrors `AsyncZlib.full_text_search`:
     * exactly one of `phrase`/`words` must be set, and `phrase` requires
     * at least two words.
     */
    suspend fun fullTextSearch(
        query: String,
        phrase: Boolean = false,
        words: Boolean = false,
        exact: Boolean = false,
        fromYear: Int? = null,
        toYear: Int? = null,
        languages: List<Language> = emptyList(),
        extensions: List<Extension> = emptyList(),
        count: Int = 10,
    ): SearchPage {
        require(phrase xor words) {
            "You should either specify 'words' to match words, or 'phrase' to match phrase."
        }
        if (phrase && query.split(" ").size < 2) {
            throw IllegalArgumentException(
                "At least 2 words must be provided for phrase search. Use 'words' to match a single word.",
            )
        }

        return searchImpl(
            fullText = true,
            query = query,
            phrase = phrase,
            exact = exact,
            fromYear = fromYear,
            toYear = toYear,
            languages = languages,
            extensions = extensions,
            count = count,
        )
    }

    /**
     * Fetches full book detail by `id` like `123/slug`. Mirrors `AsyncZlib.get_by_id`.
     */
    suspend fun getBook(id: String): BookDetail = withContext(Dispatchers.IO) {
        if (id.isBlank()) throw NoIdException("Book id must not be empty")
        val url = "$mirror/book/$id"
        val body = api.book(id = id, cookie = cookieHeader)
        bookDetailParser.parse(body, url, mirror)
    }

    /**
     * Fetches full book detail from an absolute book page URL
     * (mirrors `BookItem.fetch()`).
     */
    suspend fun getBookByUrl(url: String): BookDetail = withContext(Dispatchers.IO) {
        val body = api.getPage(url = url, cookie = cookieHeader)
        bookDetailParser.parse(body, url, mirror)
    }

    /** Downloads the file at `downloadUrl` (from a [BookDetail.downloadUrl]). */
    suspend fun downloadBook(downloadUrl: String): ResponseBody = withContext(Dispatchers.IO) {
        api.downloadFile(url = downloadUrl, cookie = cookieHeader)
    }

    /** Parsed `/users/downloads` — daily download limits. */
    suspend fun downloadLimits(): DownloadLimits = withContext(Dispatchers.IO) {
        ensureLoggedIn()
        limitsPageParser.parse(api.downloadLimits(cookie = cookieHeader))
    }

    /** Parsed `/users/dstats.php` — download history, one page. */
    suspend fun downloadHistory(
        page: Int = 1,
        dateFrom: LocalDate? = null,
        dateTo: LocalDate? = null,
    ): List<DownloadRecord> = withContext(Dispatchers.IO) {
        ensureLoggedIn()
        val format = DateTimeFormatter.ofPattern("yy-MM-dd")
        val body = api.downloadHistory(
            dateFrom = dateFrom?.format(format),
            dateTo = dateTo?.format(format),
            page = page,
            cookie = cookieHeader,
        )
        downloadsPageParser.parse(body, mirror)
    }

    /**
     * Books inside a booklist (the JSON endpoint).
     * Mirrors `BooklistItemPaginator.fetch_json`/`parse_json`.
     */
    suspend fun booklistBooks(booklistId: String, page: Int = 1): List<BookSummary> =
        withContext(Dispatchers.IO) {
            val body = api.booklistBooks(id = booklistId, page = page, cookie = cookieHeader)
            val parsed = booklistBooksAdapter.fromJson(body) ?: return@withContext emptyList()
            parsed.books.mapNotNull { wrapper ->
                val book = wrapper.book ?: return@mapNotNull null
                BookSummary(
                    id = book.id,
                    isbn = book.identifier,
                    url = book.href?.let { mirror + it },
                    cover = book.cover,
                    publisher = book.publisher,
                    authors = book.author?.split(",")?.map { it.trim() }?.filter { it.isNotEmpty() }
                        ?: emptyList(),
                    name = book.title,
                    year = book.year,
                    language = book.language,
                    extension = book.extension,
                    size = book.filesizeString,
                    rating = book.qualityScore,
                )
            }
        }

    private suspend fun searchImpl(
        fullText: Boolean,
        query: String,
        phrase: Boolean = false,
        exact: Boolean = false,
        fromYear: Int? = null,
        toYear: Int? = null,
        languages: List<Language> = emptyList(),
        extensions: List<Extension> = emptyList(),
        count: Int = 10,
    ): SearchPage = withContext(Dispatchers.IO) {
        if (!loggedIn) throw NotLoggedInException("Login required before searching")
        if (query.isBlank()) throw EmptyQueryException("Search query must not be empty")

        val pageSize = count.coerceIn(1, 50)
        val encodedQuery = URLEncoder.encode(query, "UTF-8")
        val langValues = languages.map { it.value }
        val extValues = extensions.map { it.value }

        val body = if (fullText) {
            api.fullTextSearch(
                query = encodedQuery,
                type = if (phrase) "phrase" else "words",
                exact = if (exact) 1 else null,
                fromYear = fromYear,
                toYear = toYear,
                languages = langValues,
                extensions = extValues,
                page = 1,
                cookie = cookieHeader,
            )
        } else {
            api.search(
                query = encodedQuery,
                exact = if (exact) 1 else null,
                fromYear = fromYear,
                toYear = toYear,
                languages = langValues,
                extensions = extValues,
                page = 1,
                cookie = cookieHeader,
            )
        }

        val page = searchPageParser.parse(body, mirror)
        SearchPage(results = page.results, totalPages = page.totalPages)
    }

    private fun ensureLoggedIn() {
        if (!loggedIn) throw NotLoggedInException("Login required")
    }
}
