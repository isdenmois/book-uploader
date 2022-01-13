package com.isdenmois.bookuploader.domain.usecase.upload

import com.isdenmois.bookuploader.domain.model.UploadEbook
import com.isdenmois.bookuploader.domain.repository.UploadRepository
import javax.inject.Inject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UploadEbookUseCase @Inject constructor(
    private val uploadRepository: UploadRepository,
    private val renameEbook: RenameEbookUseCase,
    private val unzipEbook: UnzipEbookUseCase,
) {
    suspend operator fun invoke(book: UploadEbook) = withContext(Dispatchers.IO) {
        renameEbook(book)
        unzipEbook(book)

        uploadRepository.uploadEbook(book).collect {
            book.setProgress(it)
        }

        book.setProgress(2f)
//        book.file.delete()
    }
}
