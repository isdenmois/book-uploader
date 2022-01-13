package com.isdenmois.bookuploader.domain.usecase.upload

import com.isdenmois.bookuploader.domain.model.UploadEbook
import java.io.File
import javax.inject.Inject

class RenameEbookUseCase @Inject constructor() {
    operator fun invoke(book: UploadEbook) {
        if (isEmpty(book)) return
        val name = getName(book)

        val from = book.file
        val ext = getExt(from)
        val to = File(from.parent, "${com.isdenmois.bookuploader.core.Transliterator.transliterate(name)}.$ext")

        if (from.name != to.name) {
            if (from.renameTo(to)) {
                book.file = to
            }
        }
    }

    private fun isEmpty(book: UploadEbook) = book.title.isEmpty() || book.title == book.file.name
    private fun getName(book: UploadEbook): String {
        val fullName = if (book.author != null && book.author.isNotEmpty()) "${book.author}_${book.title}" else book.title

        return fullName.lowercase()
    }
    private fun getExt(file: File): String {
        if (file.extension == "zip") {
            val realExt = file.name.removeSuffix(".zip").takeLastWhile { it != '.' }

            return "$realExt.zip"
        }

        return file.extension
    }
}
