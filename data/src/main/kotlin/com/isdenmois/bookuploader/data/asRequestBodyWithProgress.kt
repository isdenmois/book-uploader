package com.isdenmois.bookuploader.data

import java.io.File
import java.io.FileInputStream
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody
import okio.BufferedSink

fun File.asRequestBodyWithProgress(
    contentType: MediaType = "application/octet-stream".toMediaType(),
    progressCallback: ((progress: Float) -> Unit)
): RequestBody {
    return object : RequestBody() {
        override fun contentType() = contentType

        override fun contentLength() = length()

        override fun writeTo(sink: BufferedSink) {
            val fileLength = contentLength()
            val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
            val inSt = FileInputStream(this@asRequestBodyWithProgress)
            var uploaded = 0L
            inSt.use {
                var read: Int = inSt.read(buffer)
                while (read != -1) {
                    uploaded += read
                    val progress = (uploaded.toDouble() / fileLength.toDouble()).toFloat()

                    progressCallback(progress)

                    sink.write(buffer, 0, read)
                    read = inSt.read(buffer)
                }
            }
        }
    }
}
