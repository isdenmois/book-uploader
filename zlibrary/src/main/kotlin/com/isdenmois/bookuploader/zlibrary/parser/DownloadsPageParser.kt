package com.isdenmois.bookuploader.zlibrary.parser

import com.isdenmois.bookuploader.zlibrary.exception.ParseException
import com.isdenmois.bookuploader.zlibrary.model.DownloadRecord
import javax.inject.Inject
import javax.inject.Singleton
import org.jsoup.Jsoup

/**
 * Parses the download history page (`{mirror}/users/dstats.php`).
 * Mirrors `DownloadsPaginator.parse_page` from the Python library.
 */
@Singleton
class DownloadsPageParser @Inject constructor() {
    fun parse(body: String, mirror: String): List<DownloadRecord> {
        val doc = Jsoup.parse(body)
        val box = doc.selectFirst("div.dstats-content")
            ?: throw ParseException("Could not parse downloads list.")

        val empty = box.selectFirst("p")
        if (empty != null && empty.text().trim() == "Downloads not found") {
            return emptyList()
        }

        val rows = box.select("tr.dstats-row")
        if (rows.isEmpty()) {
            throw ParseException("Could not find the book list.")
        }

        return rows.mapNotNull { row ->
            val title = row.selectFirst("div.book-title") ?: return@mapNotNull null
            val date = row.selectFirst("td.lg-w-120") ?: return@mapNotNull null
            val href = row.selectFirst("a")?.attr("href")

            DownloadRecord(
                name = title.text().trim(),
                date = date.text().trim(),
                url = href?.let { mirror + it },
            )
        }
    }
}
