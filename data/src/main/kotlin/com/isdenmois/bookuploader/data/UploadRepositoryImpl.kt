package com.isdenmois.bookuploader.data

import android.content.Context
import com.isdenmois.bookuploader.data.remote.UploadApi
import com.isdenmois.bookuploader.domain.model.UploadEbook
import com.isdenmois.bookuploader.domain.repository.UploadRepository
import com.isdenmois.ebookparser.EBookFile
import com.isdenmois.ebookparser.EBookParser
import dagger.hilt.android.qualifiers.ApplicationContext
import java.util.regex.Pattern
import javax.inject.Inject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.withContext
import okhttp3.MultipartBody
import java.io.File

class UploadRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    private val uploadApi: UploadApi,
) : UploadRepository {
    companion object {
        private val filter = "(epub|fb2|fb2.zip|txt|pdf|mobi)\$".toPattern(Pattern.CASE_INSENSITIVE)
        private val parsable = "(epub|fb2|fb2.zip)\$".toPattern(Pattern.CASE_INSENSITIVE)
    }

    override suspend fun findAllEBookFiles(): List<UploadEbook> = withContext(Dispatchers.Default) {
        val files = context.cacheDir.listFiles() ?: arrayOf()

        return@withContext files
            .filter { filter.matcher(it.name).find() }
            .mapNotNull { parseFile(it) }
            .map { UploadEbook.create(it) }
            .sortedBy { it.title }
    }

    override suspend fun uploadEbook(eBookFile: UploadEbook): Flow<Float> = callbackFlow {
        val requestFile = eBookFile.file.asRequestBodyWithProgress { trySend(it) }
        val requestBody = MultipartBody.Part.createFormData("file", eBookFile.file.name, requestFile)

        uploadApi.uploadFile(requestBody)

        close()
    }.flowOn(Dispatchers.IO)

    private fun parseFile(file: File): EBookFile? {
        if (parsable.matcher(file.name).find()) {
            try {
                return EBookParser.parseBook(file)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        return EBookFile(title = file.name, file = file)
    }
}
