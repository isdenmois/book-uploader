package com.isdenmois.bookuploader.upload

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.domain.model.UploadEbook
import com.isdenmois.bookuploader.domain.usecase.upload.LoadEbooksUseCase
import com.isdenmois.bookuploader.domain.usecase.upload.OpenEbookUseCase
import com.isdenmois.bookuploader.domain.usecase.upload.RemoveEbookUseCase
import com.isdenmois.bookuploader.domain.usecase.upload.ScanQrUseCase
import com.isdenmois.bookuploader.domain.usecase.upload.UploadEbookUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class UploadListViewModel @Inject constructor(
    private val preferences: AppPreferences,
    private val loadEbooks: LoadEbooksUseCase,
    private val uploadEbook: UploadEbookUseCase,
    private val removeEbook: RemoveEbookUseCase,
    private val scanQrUseCase: ScanQrUseCase,
    val openEbook: OpenEbookUseCase,
) : ViewModel() {
    val bookList = mutableStateOf<List<UploadEbook>?>(null)
    val uploading = mutableStateOf(false)
    val selected = mutableStateOf(emptySet<String>())
    val address = preferences.uploadUrl

    private var fetching = false

    init {
        loadBookList()
    }

    fun toggleBook(book: UploadEbook) {
        if (book.file.name in selected.value) {
            selected.value = selected.value.minusElement(book.file.name)
        } else {
            selected.value = selected.value + book.file.name
        }
    }

    fun isSelected(book: UploadEbook): Boolean {
        return book.file.name in selected.value
    }

    fun loadBookList() {
        if (fetching || uploading.value) return

        fetching = true
        viewModelScope.launch {
            bookList.value = loadEbooks()
            fetching = false
        }
    }

    suspend fun uploadBooks() = flow {
        uploading.value = true
        bookList.value = bookList.value
            ?.filter { it.progress.value < 100 }
            ?.onEach { it.clearProgress() }

        bookList.value
            ?.filter { selected.value.isEmpty() || isSelected(it) }
            ?.forEachIndexed { index, book ->
                emit(index)

                try {
                    uploadEbook(book)
                } catch (e: Exception) {
                    book.progress.value = -1f
                    book.error.value = e.message
                }
            }

        uploading.value = false
    }.flowOn(Dispatchers.IO)

    fun removeBook(book: UploadEbook) {
        bookList.value = removeEbook(bookList.value!!, book)
    }

    fun scanQr() {
        viewModelScope.launch {
            scanQrUseCase()?.let {
                preferences.setUploadUrl(it)
            }
        }
    }
}
