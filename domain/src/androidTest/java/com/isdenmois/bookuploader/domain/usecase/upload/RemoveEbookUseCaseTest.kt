package com.isdenmois.bookuploader.domain.usecase.upload

import androidx.test.ext.junit.runners.AndroidJUnit4
import com.isdenmois.bookuploader.domain.model.UploadEbook
import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class RemoveEbookUseCaseTest {
    private val removeEbook = RemoveEbookUseCase()

    @Test
    fun shouldRemoveFile() {
        val book = UploadEbook(
            title = "Гарри ПОттер",
            author = "Д. Р. Пукер",
            file = File.createTempFile("test", ".fb2"),
        )
        val list = listOf(
            book,
            UploadEbook(
                title = "Портак Возвращение",
                author = "Д. Р. Пукер",
                file = File.createTempFile("hp2", ".fb2"),
            )
        )

        assert(book.file.exists())

        val filteredList = removeEbook(list, book)

        assert(!book.file.exists())
        assertNotEquals(list, filteredList)
        assertEquals(1, filteredList.size)
        assert(filteredList[0].file.exists())
    }
}
