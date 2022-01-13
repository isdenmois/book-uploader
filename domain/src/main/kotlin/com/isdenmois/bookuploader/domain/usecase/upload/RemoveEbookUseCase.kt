package com.isdenmois.bookuploader.domain.usecase.upload

import com.isdenmois.bookuploader.domain.model.UploadEbook
import javax.inject.Inject

class RemoveEbookUseCase @Inject constructor() {
    operator fun invoke(list: List<UploadEbook>, book: UploadEbook): List<UploadEbook> {
        if (book.file.delete()) {
            return list.filter { it !== book }
        }

        return list
    }
}
