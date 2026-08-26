package com.isdenmois.bookuploader.zlibrary.parser

import com.isdenmois.bookuploader.zlibrary.exception.ParseException
import com.isdenmois.bookuploader.zlibrary.model.BookSummary
import javax.inject.Inject
import javax.inject.Singleton
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.nodes.Element

/**
 * Parses a search results page (`{mirror}/s/...` or `{mirror}/fulltext/...`).
 * Mirrors `SearchPaginator.parse_page` from the Python library.
 */
@Singleton
class SearchPageParser @Inject constructor() {
    data class SearchPage(
        val results: List<BookSummary>,
        val totalPages: Int,
    )

    fun parse(body: String, mirror: String): SearchPage {
        val doc = Jsoup.parse(body)
        val box = doc.selectFirst("div#searchResultBox")
            ?: throw ParseException("Could not parse book list.")

        if (doc.selectFirst("div.notFound") != null) {
            return SearchPage(results = emptyList(), totalPages = 1)
        }

        val bookItems = box.select("div.book-item")
        if (bookItems.isEmpty()) {
            throw ParseException("Could not find the book list.")
        }

        val results = bookItems.mapNotNull { parseBook(it, mirror) }

        return SearchPage(results = results, totalPages = parseTotalPages(doc))
    }

    private fun parseBook(item: Element, mirror: String): BookSummary? {
        val card = item.selectFirst("z-bookcard") ?: return null
        val cover = card.selectFirst("img") ?: return null

        val coverSrc = cover.selectFirst("img")?.attr("data-src")
            ?: cover.attr("data-src")

        return BookSummary(
            id = card.attr("id").ifEmpty { null },
            isbn = card.attr("isbn").ifEmpty { null },
            url = card.attr("href").ifEmpty { null }?.let { mirror + it },
            cover = coverSrc,
            publisher = card.attr("publisher").trim().ifEmpty { null },
            authors = card.selectFirst("div[slot=author]")
                ?.text()
                ?.split(";")
                ?.map { it.trim() }
                ?.filter { it.isNotEmpty() }
                ?: emptyList(),
            name = card.selectFirst("div[slot=title]")?.text()?.trim(),
            year = card.attr("year").trim().ifEmpty { null },
            language = card.attr("language").trim().ifEmpty { null },
            extension = card.attr("extension").trim().ifEmpty { null },
            size = card.attr("filesize").trim().ifEmpty { null },
            rating = card.attr("rating").trim().ifEmpty { null },
            quality = card.attr("quality").trim().ifEmpty { null },
        )
    }

    /**
     * Scans `<script>` blocks for `var pagerOptions { ..., pagesTotal: N, ... }`.
     */
    private fun parseTotalPages(doc: Document): Int {
        doc.select("script").forEach { script ->
            val txt = script.data()
            if (txt.contains("var pagerOptions")) {
                val marker = "pagesTotal: "
                val pos = txt.indexOf(marker)
                if (pos >= 0) {
                    val count = txt.substring(pos + marker.length).substringBefore(",").trim()
                    return count.toIntOrNull() ?: 1
                }
            }
        }
        return 1
    }
}
