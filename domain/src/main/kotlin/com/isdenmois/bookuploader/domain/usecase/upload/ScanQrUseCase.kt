package com.isdenmois.bookuploader.domain.usecase.upload

import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.domain.repository.QrRepository
import javax.inject.Inject

class ScanQrUseCase @Inject constructor(
    private val qrRepository: QrRepository,
    private val preferences: AppPreferences,
) {
    suspend operator fun invoke(): String? {
        val url = qrRepository.scanQr()

        url?.let {
            preferences.setUploadUrl(url)
        }

        return url
    }
}
