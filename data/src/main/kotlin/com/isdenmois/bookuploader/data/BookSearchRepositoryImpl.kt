package com.isdenmois.bookuploader.data

import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.core.Extension
import com.isdenmois.bookuploader.core.Transliterator
import com.isdenmois.bookuploader.data.parsers.FlibustaParser
import com.isdenmois.bookuploader.data.parsers.ZLibraryParser
import com.isdenmois.bookuploader.data.remote.TorApi
import com.isdenmois.bookuploader.data.remote.downloadToFileWithProgress
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.repository.BookSearchRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import javax.inject.Inject
import javax.inject.Named

class BookSearchRepositoryImpl @Inject constructor(
    @Named("cacheDir") private val cacheDir: File,
    private val config: AppConfig,
    private val torApi: TorApi,
    private val flibustaParser: FlibustaParser,
    private val zLibraryParser: ZLibraryParser,
    private val preferences: AppPreferences,
    private val httpClient: OkHttpClient,
) : BookSearchRepository {
    override suspend fun searchBooksInFlibusta(query: String): List<Book> = withContext(Dispatchers.Default) {
        val body = torApi.textRequest(
            host = config.FLIBUSTA_HOST,
            path = flibustaParser.path,
            query = flibustaParser.query + mapOf("searchTerm" to query, "noproxy" to "true"),
        )

        return@withContext flibustaParser.parse(body)
    }

    override suspend fun searchBooksInFlibustaTor(query: String): List<Book> = withContext(Dispatchers.Default) {
        val body = torApi.textRequest(
            host = config.FLIBUSTA_TOR_HOST,
            path = flibustaParser.path,
            query = flibustaParser.query + mapOf("searchTerm" to query),
        )

        return@withContext flibustaParser.parse(body)
    }

    override suspend fun downloadFlibustaBook(book: Book): Flow<Float> = torApi.downloadFile(
        host = config.FLIBUSTA_HOST,
        query = mapOf("noproxy" to "true"),
        path = book.link,
    ).downloadToFileWithProgress(cacheDir, book.getFileName())

    override suspend fun downloadFlibustaTorBook(book: Book): Flow<Float> = torApi.downloadFile(
        host = config.FLIBUSTA_TOR_HOST,
        path = book.link,
    ).downloadToFileWithProgress(cacheDir, book.getFileName())

    override suspend fun searchBooksInZLibrary(query: String, extension: Extension?): List<Book> =
        withContext(Dispatchers.Default) {
            val queryMap = if (extension == null) mapOf() else mapOf("extensions" to extension.value)
            val response = torApi.postForm(
                host = config.ZLIB_HOST,
                path = "/eapi/book/search",
                body = queryMap + mapOf(
                    "message" to query,
                    "limit" to "50",
                    "order" to "popular",
                ),
                cookie = preferences.zlibAuth.value,
            )

            return@withContext zLibraryParser.parseBody(response.body() ?: "{\"success\": 0}", extension?.value)
        }

    override suspend fun downloadZLibraryBook(book: Book): Flow<Float> {
        val url = zLibraryParser.getFilePath(book.link)

        return withContext(Dispatchers.IO) {
            val request = Request.Builder().url(url).build();
            val response = httpClient.newCall(request).execute()
            val body = response.body ?: return@withContext flowOf(100.0f)

            return@withContext body.downloadToFileWithProgress(cacheDir, book.getFileName())
        }
    }
}

fun Book.getFileName() = Transliterator.transliterate("${authors}_$title.$ext")
