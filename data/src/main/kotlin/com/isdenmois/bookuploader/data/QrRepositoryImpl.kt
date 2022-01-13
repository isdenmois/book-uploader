package com.isdenmois.bookuploader.data

import android.app.Activity.RESULT_CANCELED
import android.app.Activity.RESULT_OK
import android.content.Context
import android.content.Intent
import android.net.Uri
import com.isdenmois.bookuploader.domain.repository.QrRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class QrRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    private val activityResultManager: ActivityResultManager,
) : QrRepository {
    override suspend fun scanQr(): String? = suspendCoroutine { cont ->
        try {
            val intent = Intent("com.google.zxing.client.android.SCAN").apply {
                putExtra("SCAN_MODE", "QR_CODE_MODE") // "PRODUCT_MODE for bar codes
            }

            activityResultManager.startActivityForResult(intent, 123) { resultCode, data ->
                when (resultCode) {
                    RESULT_OK -> cont.resume(data?.getStringExtra("SCAN_RESULT"))
                    RESULT_CANCELED -> cont.resume(null)
                }
            }
        } catch (e: Exception) {
            val marketUri = Uri.parse("market://details?id=com.google.zxing.client.android")
            val marketIntent = Intent(Intent.ACTION_VIEW, marketUri).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(marketIntent)
            cont.resume(null)
        }
    }
}
