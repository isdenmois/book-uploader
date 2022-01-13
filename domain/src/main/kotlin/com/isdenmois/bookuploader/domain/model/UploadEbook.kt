package com.isdenmois.bookuploader.domain.model

import android.graphics.Bitmap
import androidx.compose.runtime.mutableStateOf
import com.isdenmois.ebookparser.EBookFile
import java.io.File

data class UploadEbook(
    val title: String,
    val author: String? = null,
    val cover: Bitmap? = null,
    var file: File
) {
    companion object {
        fun create(eBookFile: EBookFile) = UploadEbook(
            title = eBookFile.title,
            author = eBookFile.author,
            cover = eBookFile.cover,
            file = eBookFile.file
        )
    }

    val progress = mutableStateOf(-1f)
    val error = mutableStateOf<String?>(null)

    fun setProgress(value: Float) {
        progress.value = value
    }

    fun clearProgress() {
        progress.value = -1f
        error.value = null
    }
}
