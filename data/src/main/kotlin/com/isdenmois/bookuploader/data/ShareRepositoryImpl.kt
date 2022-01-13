package com.isdenmois.bookuploader.data

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.core.content.FileProvider
import com.isdenmois.bookuploader.domain.repository.ShareRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import javax.inject.Inject

class ShareRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
) : ShareRepository {
    override fun shareEbook(file: File) {
        if (!file.exists()) {
            Log.d("shareBook", "File not found")
            return
        }

        try {
            val intent = getShareIntent(file)

            if (intent.resolveActivity(context.packageManager) != null) {
                context.startActivity(intent)
            }
        } catch (e: ActivityNotFoundException) {
            Log.d("shareBook", "Open error!!")
        }
    }

    private fun getShareIntent(file: File) = Intent(Intent.ACTION_VIEW).apply {
        val uriForFile = FileProvider.getUriForFile(context, "${context.packageName}.provider", file)

        setDataAndType(uriForFile, file.contentType())
        flags = Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK
    }
}

private fun File.contentType(): String = when (extension) {
    "epub" -> "application/epub"
    else -> "application/fb2"
}
