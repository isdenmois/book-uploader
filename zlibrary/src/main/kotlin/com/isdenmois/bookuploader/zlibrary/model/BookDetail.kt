package com.isdenmois.bookuploader.zlibrary.model

/**
 * Full book detail from the book detail page (`/book/{id}`).
 * Mirrors the parsed dict returned by `BookItem.fetch()`.
 */
data class BookDetail(
    val url: String,
    val name: String? = null,
    val cover: String? = null,
    val authors: List<Author> = emptyList(),
    val description: String? = null,
    val year: String? = null,
    val edition: String? = null,
    val publisher: String? = null,
    val language: String? = null,
    val isbn: Map<String, String> = emptyMap(),
    val categories: String? = null,
    val categoriesUrl: String? = null,
    val extension: String? = null,
    val size: String? = null,
    val rating: String? = null,
    val downloadUrl: String? = null,
) {
    data class Author(
        val author: String,
        val authorUrl: String,
    )
}
