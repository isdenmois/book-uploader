package com.isdenmois.bookuploader.zlibrary.model

/**
 * Daily download limits parsed from `/users/downloads`.
 * Mirrors `ZlibProfile.get_limits()`.
 */
data class DownloadLimits(
    val dailyAmount: Int,
    val dailyAllowed: Int,
    val dailyRemaining: Int,
    val dailyReset: String,
)
