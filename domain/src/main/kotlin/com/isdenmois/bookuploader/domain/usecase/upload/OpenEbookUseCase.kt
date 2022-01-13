package com.isdenmois.bookuploader.domain.usecase.upload

import com.isdenmois.bookuploader.domain.model.UploadEbook
import com.isdenmois.bookuploader.domain.repository.ShareRepository
import javax.inject.Inject

class OpenEbookUseCase @Inject constructor(
    private val shareRepository: ShareRepository,
) {
    operator fun invoke(book: UploadEbook) {
        shareRepository.shareEbook(book.file)
    }
}
