package com.isdenmois.bookuploader.data.parsers

import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.data.remote.TorApi
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jsoup.Jsoup
import org.jsoup.nodes.Element

@Singleton
class ZLibraryParser @Inject constructor(
    config: AppConfig,
    private val torApi: TorApi,
    private val preferences: AppPreferences,
) :
    BookParser() {
    override val host = config.ZLIB_HOST
    override val path = "/s/"
    override val query = mapOf("e" to "1")

    override val entrySelector = "#searchResultBox .resItemBox"

    override fun parseEntry(entry: Element): Book? {
        val link = entry.propertySelector("h3[itemprop=\"name\"] a", "href") ?: return null

        return Book(
            id = link,
            link = link,
            type = ProviderType.ZLIBRARY,
            ext = entry.cutSelector(".property__file .property_value", ",.*".toRegex()) ?: return null,
            title = entry.textSelector("h3[itemprop=\"name\"] a"),
            authors = entry.listTextSelector(".authors a"),
            language = entry.cutSelector(".property_language", "Language:"),
            size = entry.cutSelector(".property__file .property_value", ".*,".toRegex()),
            translation = null,
            cover = null,
        )
    }

    suspend fun getFilePath(link: String): String = withContext(Dispatchers.Default) {
        val body = torApi.textRequest(host = host, path = link, cookie = preferences.zlibAuth.value)
        val doc = Jsoup.parse(body)

        return@withContext doc.select("a.addDownloadedBook").attr("href")
    }
}
