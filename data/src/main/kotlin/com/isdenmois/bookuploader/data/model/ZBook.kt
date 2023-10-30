package com.isdenmois.bookuploader.data.model

data class ZBook(
    val id: String,
    val hash: String,
    val title: String,
    val extension: String?,
    val author: String?,
    val language: String?,
    val filesizeString: String?,
    val dl: String,
)

data class ZSearchResponse(
    val success: Int,
    val books: List<ZBook>?,
)

data class ZFile(
    val allowDownload: Boolean,
    val downloadLink: String?,
)

data class ZDownloadLinkResponse(
    val success: Int,
    val file: ZFile?
)
