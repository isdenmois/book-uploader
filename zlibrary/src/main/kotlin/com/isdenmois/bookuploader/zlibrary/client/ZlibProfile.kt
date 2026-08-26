package com.isdenmois.bookuploader.zlibrary.client

/**
 * Session handle returned by [ZlibClient.login], mirroring the Python
 * `ZlibProfile`. Delegates the authenticated calls back to the client.
 */
class ZlibProfile internal constructor(
    private val client: ZlibClient,
    val mirror: String,
) {
    suspend fun getLimits() = client.downloadLimits()

    suspend fun downloadHistory(
        page: Int = 1,
        dateFrom: java.time.LocalDate? = null,
        dateTo: java.time.LocalDate? = null,
    ) = client.downloadHistory(page = page, dateFrom = dateFrom, dateTo = dateTo)
}
