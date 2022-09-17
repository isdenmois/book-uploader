package com.isdenmois.bookuploader.data.parsers

import com.isdenmois.bookuploader.domain.model.Book
import java.util.regex.Pattern
import org.jsoup.Jsoup
import org.jsoup.nodes.Element

abstract class BookParser {
    abstract val path: String
    abstract val query: Map<String, String>

    protected abstract val entrySelector: String

    protected abstract fun parseEntry(entry: Element): Book?

    fun parse(body: String): List<Book> {
        val doc = Jsoup.parse(body)

        val entries = doc.select(entrySelector)

        return entries.mapNotNull { parseEntry(it) }
    }
}

fun Element.textSelector(selector: String) = select(selector).text().trim()

fun Element.propertySelector(selector: String, property: String): String? {
    val value = select(selector).attr(property)

    if (value.isBlank()) {
        return null
    }

    return value
}

fun Element.listTextSelector(selector: String): String? {
    val entries = select(selector)

    if (entries.size > 1) {
        return entries.joinToString(separator = "; ") { it.text().trim() }
    }

    if (entries.size == 1) {
        return entries.text().trim()
    }

    return null
}

fun Element.matchSelector(selector: String, pattern: Pattern): String? {
    val text = select(selector).text()
    val matcher = pattern.matcher(text)
    var value: String? = null

    if (matcher.find()) {
        value = matcher.group(1)
    }

    if (value.isNullOrBlank()) {
        return null
    }

    return value
}

fun Element.cutSelector(selector: String, toReplace: Regex): String? {
    val value = select(selector).text().replace(toReplace, "").trim()

    if (value.isBlank()) {
        return null
    }

    return value
}

fun Element.cutSelector(selector: String, toReplace: String): String? {
    val value = select(selector).text().replace(toReplace, "", ignoreCase = true).trim()

    if (value.isBlank()) {
        return null
    }

    return value
}
