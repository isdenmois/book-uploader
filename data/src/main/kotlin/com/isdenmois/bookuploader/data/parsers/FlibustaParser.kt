package com.isdenmois.bookuploader.data.parsers

import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType
import org.jsoup.nodes.Element
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FlibustaParser @Inject constructor() : BookParser() {
    companion object {
        private val translationPattern = "Перевод:\\s?(.+?)\\s*[&<]".toPattern()
        private val languagePattern = "Язык:\\s?(.+?)\\s*[&<]".toPattern()
        private val sizePattern = "Размер:\\s?(.+?)\\s*[&<]".toPattern()
    }

    override val path = "/opds/search"
    override val query = mapOf("searchType" to "books")

    override val entrySelector = "entry"

    override fun parseEntry(entry: Element): Book? {
        val link = entry.propertySelector("link[href\$=\"fb2\"]", "href") ?: return null

        return Book(
            id = link,
            link = link,
            type = ProviderType.FLIBUSTA_OLD,
            ext = "fb2.zip",
            title = entry.textSelector("title"),
            authors = entry.listTextSelector("author name"),
            translation = entry.matchSelector("content", translationPattern),
            language = entry.matchSelector("content", languagePattern),
            size = entry.matchSelector("content", sizePattern),
        )
    }
}
