package com.isdenmois.bookuploader.zlibrary.parser

import com.isdenmois.bookuploader.zlibrary.exception.ParseException
import com.isdenmois.bookuploader.zlibrary.model.DownloadLimits
import javax.inject.Inject
import javax.inject.Singleton
import org.jsoup.Jsoup

/**
 * Parses the download limits page (`{mirror}/users/downloads`).
 * Mirrors `ZlibProfile.get_limits()` from the Python library.
 */
@Singleton
class LimitsPageParser @Inject constructor() {
    fun parse(body: String): DownloadLimits {
        val doc = Jsoup.parse(body)
        val dstats = doc.selectFirst("div.dstats-info")
            ?: throw ParseException("Could not parse download limit at url.")

        val dlInfo = dstats.selectFirst("div.d-count")
            ?: throw ParseException("Could not parse download limit info at url.")
        val parts = dlInfo.text().trim().split("/")
        if (parts.size < 2) {
            throw ParseException("Could not parse download limit info at url.")
        }
        val daily = parts[0].trim().toInt()
        val allowed = parts[1].trim().toInt()

        val reset = dstats.selectFirst("div.d-reset")?.text()?.trim() ?: ""

        return DownloadLimits(
            dailyAmount = daily,
            dailyAllowed = allowed,
            dailyRemaining = allowed - daily,
            dailyReset = reset,
        )
    }
}
