package com.isdenmois.bookuploader.domain.usecase.upload

import com.isdenmois.bookuploader.domain.model.UploadEbook
import com.isdenmois.bookuploader.domain.repository.UploadRepository
import javax.inject.Inject

/**
 * Use case to get a books list.
 */
class LoadEbooksUseCase @Inject constructor(
    private val uploadRepository: UploadRepository,
) {
    suspend operator fun invoke(): List<UploadEbook> = uploadRepository.findAllEBookFiles()
}
