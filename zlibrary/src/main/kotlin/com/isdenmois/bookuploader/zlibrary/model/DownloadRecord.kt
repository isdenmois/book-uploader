package com.isdenmois.bookuploader.zlibrary.model

/**
 * A single download-history row parsed from `/users/dstats.php`.
 */
data class DownloadRecord(
    val name: String,
    val date: String,
    val url: String? = null,
)
