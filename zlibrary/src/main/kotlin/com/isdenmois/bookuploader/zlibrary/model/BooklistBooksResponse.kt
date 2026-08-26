package com.isdenmois.bookuploader.zlibrary.model

import com.squareup.moshi.Json

/**
 * JSON response of `{mirror}/papi/booklist/{id}/get-books/{page}`.
 * Mirrors the Python `BooklistItemPaginator.parse_json`.
 */
data class BooklistBooksResponse(
    val books: List<BooklistBookWrapper> = emptyList(),
    val pagination: BooklistPagination = BooklistPagination(),
)

data class BooklistBookWrapper(
    val book: BooklistBook? = null,
)

data class BooklistBook(
    val id: String? = null,
    val identifier: String? = null,
    val href: String? = null,
    val cover: String? = null,
    val title: String? = null,
    val publisher: String? = null,
    val author: String? = null,
    val year: String? = null,
    val language: String? = null,
    val extension: String? = null,
    val filesizeString: String? = null,
    val qualityScore: String? = null,
)

data class BooklistPagination(
    @Json(name = "total_pages") val totalPages: Int = 1,
)
