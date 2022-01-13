package com.isdenmois.bookuploader.domain.usecase.upload

import android.os.FileUtils
import com.isdenmois.bookuploader.domain.model.UploadEbook
import java.io.File
import java.util.zip.ZipEntry
import java.util.zip.ZipFile
import javax.inject.Inject

class UnzipEbookUseCase @Inject constructor() {
    operator fun invoke(book: UploadEbook) {
        if (!book.file.name.endsWith(".fb2.zip")) return
        val to = File(book.file.parent, book.file.name.removeSuffix(".zip"))

        ZipFile(book.file).use { zip ->
            val entry = findFb2(zip)

            zip.getInputStream(entry).use { input ->
                FileUtils.copy(input, to.outputStream())
            }
        }

        if (to.exists()) {
            book.file.delete()
            book.file = to
        }
    }

    private fun findFb2(zip: ZipFile): ZipEntry? = zip.entries().asSequence().find { it.name.endsWith(".fb2") }
}
