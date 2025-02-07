package com.isdenmois.bookuploader.data.parsers

import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.data.model.ZDownloadLinkResponse
import com.isdenmois.bookuploader.data.model.ZSearchResponse
import com.isdenmois.bookuploader.data.remote.TorApi
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ZLibraryParser @Inject constructor(
    private val config: AppConfig,
    private val torApi: TorApi,
    private val preferences: AppPreferences,
    moshi: Moshi,
) {
    private val searchAdapter: JsonAdapter<ZSearchResponse> = moshi.adapter(ZSearchResponse::class.java)
    private val downloadLinkAdapter = moshi.adapter(ZDownloadLinkResponse::class.java)

    fun parseBody(body: String, extension: String?): List<Book> {
        val result = searchAdapter.fromJson(body) ?: return emptyList()

        if (result.success == 0 || result.books.isNullOrEmpty()) {
            return emptyList()
        }

        return result.books.map {
            Book(
                id = it.id,
                title = it.title,
                link = "/eapi/book/${it.id}/${it.hash}/file",
                ext = extension ?: it.extension ?: "NOPE",
                type = ProviderType.ZLIBRARY,
                authors = it.author,
                language = it.language,
                size = it.filesizeString,
            )
        }
    }

    suspend fun getFilePath(link: String): String = withContext(Dispatchers.Default) {
        val body = torApi.textRequest(host = config.ZLIB_HOST, path = link, cookie = preferences.zlibAuth.value)
        val result = downloadLinkAdapter.fromJson(body)

        if (result?.success == 1 && result.file?.allowDownload == true) {
            return@withContext result.file.downloadLink ?: "null"
        }

        return@withContext "null"
    }
}
