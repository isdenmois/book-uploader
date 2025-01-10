package com.isdenmois.bookuploader.data.model

import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType

data class FBook(
    val id: String,
    val title: String,
    val file: String,
    val authors: String? = null,
    val series: String? = null,
    val size: Int? = null,
    val lang: String? = null,
)

fun FBook.toBook() = Book(
        id = id,
        type = ProviderType.FLIBUSTA,
        ext = "fb2",
        title = title,
        authors = authors,
        link = file,
        size = formatSize(size),
        language = lang,
        series = series,
    )

fun formatSize(size: Int?): String? {
    if (size == null || size < 1) {
        return null
    }

    if (size > 10240) {
        val kb = Math.round(size / 1024.0)

        return "${kb}Kb"
    }

    val kb = Math.round(size * 100 / 1024.0) / 100.0

    return "${kb}Kb"
}
