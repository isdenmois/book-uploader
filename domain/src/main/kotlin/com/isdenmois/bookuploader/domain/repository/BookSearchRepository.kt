package com.isdenmois.bookuploader.domain.repository

import com.isdenmois.bookuploader.core.Extension
import com.isdenmois.bookuploader.domain.model.Book
import kotlinx.coroutines.flow.Flow

interface BookSearchRepository {
    /**
     * Produces search for books in flibusta
     */
    suspend fun searchBooksInFlibusta(query: String): List<Book>

    /**
     * Downloads the book to the cache file
     */
    suspend fun downloadFlibustaBook(book: Book): Flow<Float>

    /**
     * Produces search for books in zlibrary
     */
    suspend fun searchBooksInZLibrary(query: String, extension: Extension): List<Book>

    /**
     * Downloads the book to the cache file
     */
    suspend fun downloadZLibraryBook(book: Book): Flow<Float>
}
