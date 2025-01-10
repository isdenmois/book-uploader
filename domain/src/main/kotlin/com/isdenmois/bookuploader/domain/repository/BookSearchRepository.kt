package com.isdenmois.bookuploader.domain.repository

import com.isdenmois.bookuploader.core.Extension
import com.isdenmois.bookuploader.domain.model.Book
import kotlinx.coroutines.flow.Flow

interface BookSearchRepository {
    suspend fun searchBooksInFlibusta(query: String): List<Book>
    /**
     * Produces search for books in flibusta
     */
    suspend fun searchBooksInFlibustaOld(query: String): List<Book>

    /**
     * Downloads the book to the cache file (old)
     */
    suspend fun downloadFlibustaBook(book: Book): Flow<Float>

    /**
     * Produces search for books in flibusta (old)
     */
    suspend fun searchBooksInFlibustaTor(query: String): List<Book>

    /**
     * Downloads the book to the cache file (old)
     */
    suspend fun downloadFlibustaOldBook(book: Book): Flow<Float>

    /**
     * Downloads the book to the cache file
     */
    suspend fun downloadFlibustaTorBook(book: Book): Flow<Float>

    /**
     * Produces search for books in zlibrary
     */
    suspend fun searchBooksInZLibrary(query: String, extension: Extension?): List<Book>

    /**
     * Downloads the book to the cache file
     */
    suspend fun downloadZLibraryBook(book: Book): Flow<Float>
}
