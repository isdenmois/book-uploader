package com.isdenmois.bookuploader.domain.repository

interface QrRepository {
    /**
     * Scans QR code
     */
    suspend fun scanQr(): String?
}
