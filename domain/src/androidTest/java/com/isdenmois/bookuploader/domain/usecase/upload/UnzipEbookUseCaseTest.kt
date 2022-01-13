package com.isdenmois.bookuploader.domain.usecase.upload

import androidx.test.ext.junit.runners.AndroidJUnit4
import com.isdenmois.bookuploader.domain.TestFileLoader
import com.isdenmois.bookuploader.domain.model.UploadEbook
import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class UnzipEbookUseCaseTest {
    private val unzipEbook = UnzipEbookUseCase()

    @Test
    fun doNotUnzipFb2andEPUB() {
        val fb2 = UploadEbook(
            title = "Гарри ПОттер",
            author = "Д. Р. Пукер",
            file = File("/tmp", "hp.fb2"),
        )

        val epub = UploadEbook(
            title = "Гарри ПОттер",
            author = "Д. Р. Пукер",
            file = File("/tmp", "hp.epub"),
        )

        unzipEbook(fb2)
        assertEquals("hp.fb2", fb2.file.name)

        unzipEbook(epub)
        assertEquals("hp.epub", epub.file.name)
    }

    @Test
    fun unzipFb2Zip() {
        val book = UploadEbook(
            title = "Гарри ПОттер",
            author = "Д. Р. Пукер",
            file = TestFileLoader.loadFile("hp1.fb2.zip"),
        )

        unzipEbook(book)
        assertEquals("hp1.fb2", book.file.name)
    }
}
