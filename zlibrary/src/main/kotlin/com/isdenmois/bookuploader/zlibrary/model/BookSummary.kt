package com.isdenmois.bookuploader.zlibrary.model

/**
 * A single book entry from a search results page (`z-bookcard` element).
 * Mirrors the Python `BookItem` dict produced by `SearchPaginator.parse_page`.
 */
data class BookSummary(
    val id: String? = null,
    val isbn: String? = null,
    val url: String? = null,
    val cover: String? = null,
    val publisher: String? = null,
    val authors: List<String> = emptyList(),
    val name: String? = null,
    val year: String? = null,
    val language: String? = null,
    val extension: String? = null,
    val size: String? = null,
    val rating: String? = null,
    val quality: String? = null,
)
