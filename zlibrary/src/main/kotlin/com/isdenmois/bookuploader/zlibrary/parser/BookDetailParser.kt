package com.isdenmois.bookuploader.zlibrary.parser

import com.isdenmois.bookuploader.zlibrary.exception.ParseException
import com.isdenmois.bookuploader.zlibrary.model.BookDetail
import java.net.URLEncoder
import javax.inject.Inject
import javax.inject.Singleton
import org.jsoup.Jsoup
import org.jsoup.nodes.Element

/**
 * Parses a book detail page (`{mirror}/book/{id}`).
 * Mirrors `BookItem.fetch()` from the Python library.
 */
@Singleton
class BookDetailParser @Inject constructor() {
    private val textProperties = listOf("year", "edition", "publisher", "language")

    fun parse(body: String, url: String, mirror: String): BookDetail {
        val doc = Jsoup.parse(body)
        val wrap = doc.selectFirst("div.row.cardBooks")
            ?: throw ParseException("Failed to parse $url")

        val zcover = doc.selectFirst("z-cover")
            ?: throw ParseException("Failed to find zcover in $url")

        val details = wrap.selectFirst("div.bookDetailsBox")

        return BookDetail(
            url = url,
            authors = parseAuthors(wrap, mirror),
            name = parseName(zcover),
            cover = zcover.selectFirst("img.image")?.attr("src"),
            description = wrap.selectFirst("div#bookDescriptionBox")?.text()?.trim(),
            year = propertyValue(details, "property_year"),
            edition = propertyValue(details, "property_edition"),
            publisher = propertyValue(details, "property_publisher"),
            language = propertyValue(details, "property_language"),
            isbn = parseIsbns(details),
            categories = categoriesText(details),
            categoriesUrl = categoriesUrl(details, mirror),
            extension = parseFile(details)?.first,
            size = parseFile(details)?.second,
            rating = parseRating(wrap),
            downloadUrl = parseDownloadUrl(doc, mirror),
        )
    }

    private fun parseAuthors(wrap: Element, mirror: String): List<BookDetail.Author> {
        val col = wrap.selectFirst("div.col-sm-9") ?: return emptyList()
        return col.select("a").mapNotNull { anchor ->
            val name = anchor.text().trim()
            if (name.isEmpty()) return@mapNotNull null
            val href = anchor.attr("href")
            BookDetail.Author(
                author = name,
                authorUrl = mirror + URLEncoder.encode(href, "UTF-8"),
            )
        }
    }

    private fun parseName(zcover: Element): String? {
        val title = zcover.attr("title")
        if (title.isNotEmpty()) return title.trim()
        // z-cover may carry multiple titles as a JS array string; take the first
        val first = zcover.selectFirst("div[slot=title]")?.text()?.trim()
        return first
    }

    private fun propertyValue(details: Element?, propertyClass: String): String? {
        if (details == null) return null
        return details.selectFirst("div.$propertyClass div.property_value")?.text()?.trim()
            ?.ifEmpty { null }
    }

    private fun parseIsbns(details: Element?): Map<String, String> {
        if (details == null) return emptyMap()
        val result = mutableMapOf<String, String>()
        details.select("div.property_isbn").forEach { isbn ->
            val label = isbn.selectFirst("div.property_label")?.text()?.trimEnd(':') ?: return@forEach
            val value = isbn.selectFirst("div.property_value")?.text()?.trim() ?: return@forEach
            result[label] = value
        }
        return result
    }

    private fun categoriesText(details: Element?): String? {
        if (details == null) return null
        return details.selectFirst("div.property_categories div.property_value")?.text()?.trim()
            ?.ifEmpty { null }
    }

    private fun categoriesUrl(details: Element?, mirror: String): String? {
        if (details == null) return null
        val link = details.selectFirst("div.property_categories div.property_value a") ?: return null
        val href = link.attr("href")
        return mirror + href
    }

    /**
     * `div.property__file` text looks like `"\nEPUB\n, 1.23 MB"`.
     * Split on `,` → extension = part0's 2nd line, size = part1.
     */
    private fun parseFile(details: Element?): Pair<String, String>? {
        if (details == null) return null
        val file = details.selectFirst("div.property__file") ?: return null
        val parts = file.text().trim().split(",")
        if (parts.size < 2) return null

        val extension = parts[0].split("\n").getOrNull(1)?.trim()?.ifEmpty { null }
            ?: return null
        val size = parts[1].trim().ifEmpty { null } ?: return null
        return extension to size
    }

    /**
     * Rating text like `" 5.0 / 5.0\n"` with all whitespace removed → `"5.0/5.0"`.
     */
    private fun parseRating(wrap: Element): String? {
        val rating = wrap.selectFirst("div.book-rating") ?: return null
        return rating.text().replace("\n", "").replace(" ", "").trim().ifEmpty { null }
    }

    /**
     * Download button; if its text mentions "unavailable" the download is
     * not accessible on the clearnet mirror (Tor required).
     */
    private fun parseDownloadUrl(doc: org.jsoup.nodes.Document, mirror: String): String? {
        val button = doc.selectFirst("a.btn.btn-default.addDownloadedBook") ?: return null
        return if (button.text().contains("unavailable", ignoreCase = true)) {
            UNAVAILABLE_DOWNLOAD
        } else {
            mirror + button.attr("href")
        }
    }

    companion object {
        const val UNAVAILABLE_DOWNLOAD = "Unavailable (use tor to download)"
    }
}
