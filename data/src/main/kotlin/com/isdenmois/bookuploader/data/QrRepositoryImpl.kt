package com.isdenmois.bookuploader.data

import com.google.mlkit.vision.codescanner.GmsBarcodeScanner
import com.isdenmois.bookuploader.domain.repository.QrRepository
import javax.inject.Inject
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class QrRepositoryImpl @Inject constructor(
    private val scanner: GmsBarcodeScanner,
) : QrRepository {
    override suspend fun scanQr(): String? = suspendCoroutine { cont ->
        try {
            scanner.startScan()
                .addOnSuccessListener { code ->
                    cont.resume(code.rawValue)
                }
                .addOnCanceledListener {
                    cont.resume(null)
                }
                .addOnFailureListener {
                    cont.resume(null)
                }
        } catch (_: Exception) {
            cont.resume(null)
        }
    }
}
