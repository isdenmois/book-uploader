package com.isdenmois.bookuploader.domain.usecase.upload

import androidx.test.ext.junit.runners.AndroidJUnit4
import com.isdenmois.bookuploader.domain.model.UploadEbook
import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class RenameEbookUseCaseTest {
    private val renameEbook = RenameEbookUseCase()

    @Test
    fun shouldTransliterate() {
        val book = UploadEbook(
            title = "Гарри ПОчер",
            author = "Д. Р. Пукер",
            file = File.createTempFile("test", ".fb2"),
        )

        renameEbook(book)

        assertEquals("d-r-puker_garri-pocher.fb2", book.file.name)
    }

    @Test
    fun shouldWorksWithZip() {
        val book = UploadEbook(
            title = "Гарри ПОчер",
            author = "Ольга Пюпункер",
            file = File.createTempFile("test", ".fb2.zip"),
        )

        renameEbook(book)

        assertEquals("olga-pyupunker_garri-pocher.fb2.zip", book.file.name)
    }
}
