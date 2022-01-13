package com.isdenmois.bookuploader.data

import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.core.Extension
import com.isdenmois.bookuploader.core.Transliterator
import com.isdenmois.bookuploader.data.parsers.FlibustaParser
import com.isdenmois.bookuploader.data.parsers.ZLibraryParser
import com.isdenmois.bookuploader.data.remote.TorApi
import com.isdenmois.bookuploader.data.remote.downloadToFileWithProgress
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.repository.BookSearchRepository
import java.io.File
import javax.inject.Inject
import javax.inject.Named
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext

class BookSearchRepositoryImpl @Inject constructor(
    @Named("cacheDir") private val cacheDir: File,
    private val torApi: TorApi,
    private val flibustaParser: FlibustaParser,
    private val zLibraryParser: ZLibraryParser,
    private val preferences: AppPreferences,
) : BookSearchRepository {
    override suspend fun searchBooksInFlibusta(query: String): List<Book> = withContext(Dispatchers.Default) {
        val body = torApi.textRequest(
            host = flibustaParser.host,
            path = flibustaParser.path,
            query = flibustaParser.query + mapOf("searchTerm" to query),
        )

        return@withContext flibustaParser.parse(body)
    }

    override suspend fun downloadFlibustaBook(book: Book): Flow<Float> = torApi.downloadFile(
        host = flibustaParser.host,
        path = book.link,
    ).downloadToFileWithProgress(cacheDir, book.getFileName())

    override suspend fun searchBooksInZLibrary(query: String, extension: Extension): List<Book> =
        withContext(Dispatchers.Default) {
            val body = torApi.textRequest(
                host = zLibraryParser.host,
                path = zLibraryParser.path + query,
                query = zLibraryParser.query + mapOf("extensions[]" to extension.value),
                cookie = preferences.zlibAuth.value,
            )

            return@withContext zLibraryParser.parse(body)
        }

    override suspend fun downloadZLibraryBook(book: Book): Flow<Float> = torApi.downloadFile(
        host = zLibraryParser.host,
        path = zLibraryParser.getFilePath(book.link),
        query = mapOf("nofollow" to "true"),
        cookie = preferences.zlibAuth.value,
    ).downloadToFileWithProgress(cacheDir, book.getFileName())
}

fun Book.getFileName() = Transliterator.transliterate("${authors}_$title.$ext")
