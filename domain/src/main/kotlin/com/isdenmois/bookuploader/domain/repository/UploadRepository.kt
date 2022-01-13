package com.isdenmois.bookuploader.domain.repository

import com.isdenmois.bookuploader.domain.model.UploadEbook
import kotlinx.coroutines.flow.Flow

interface UploadRepository {
    /**
     * Get all files from the cache directory.
     */
    suspend fun findAllEBookFiles(): List<UploadEbook>

    /**
     * Uploads ebook file
     */
    suspend fun uploadEbook(eBookFile: UploadEbook): Flow<Float>
}
