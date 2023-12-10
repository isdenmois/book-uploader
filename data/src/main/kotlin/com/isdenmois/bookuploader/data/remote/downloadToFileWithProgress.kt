package com.isdenmois.bookuploader.data.remote

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import okhttp3.ResponseBody
import okio.use
import java.io.File
import java.io.OutputStream

fun ResponseBody.downloadToFileWithProgress(directory: File, filename: String): Flow<Float> = flow {
    // flag to delete file if download errors or is cancelled
    var deleteFile = true
    val file = File(directory, filename)

    try {
        byteStream().use { inputStream ->
            file.outputStream().use { outputStream ->
                val totalBytes = contentLength()
                val data = ByteArray(8_192)
                var progressBytes = 0L

                while (true) {
                    val bytes = inputStream.read(data)

                    if (bytes == -1) {
                        break
                    }

                    outputStream.channel
                    outputStream.write(data, 0, bytes)
                    progressBytes += bytes

                    emit(progressBytes.toFloat() / totalBytes)
                }

                when {
                    progressBytes < totalBytes ->
                        throw Exception("missing bytes")
                    progressBytes > totalBytes ->
                        throw Exception("too many bytes")
                    else ->
                        deleteFile = false
                }
            }
        }

        emit(2f)
    } finally {
        // check if download was successful
        if (deleteFile) {
            file.delete()
        }
    }
}
    .flowOn(Dispatchers.IO)
    .distinctUntilChanged()

fun ResponseBody.downloadToStreamWithProgress(stream: OutputStream): Flow<Float> = flow {
    try {
        val totalBytes = contentLength()

        byteStream().use { inputStream ->
            stream.use { outputStream ->
                val data = ByteArray(8_192)
                var progressBytes = 0L

                while (true) {
                    val bytes = inputStream.read(data)

                    if (bytes == -1) {
                        break
                    }

                    outputStream.write(data, 0, bytes)
                    progressBytes += bytes

                    emit(progressBytes.toFloat() / totalBytes)
                }
            }
        }

        emit(2f)
    } finally {
        emit(-1f)
    }
}
    .flowOn(Dispatchers.IO)
    .distinctUntilChanged()
