package com.isdenmois.bookuploader.search

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.core.Extension
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType
import com.isdenmois.bookuploader.domain.usecase.search.DownloadBookUseCase
import com.isdenmois.bookuploader.domain.usecase.search.SearchBooksUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.launch

@HiltViewModel
class SearchViewModel @Inject constructor(
    private val searchBooksUseCase: SearchBooksUseCase,
    private val downloadBookUseCase: DownloadBookUseCase,
    appPreferences: AppPreferences,
) : ViewModel() {
    val zlibAuth = appPreferences.zlibAuth

    var query by mutableStateOf("")

    val provider = mutableStateOf(if (zlibAuth.value.isNullOrBlank()) ProviderType.FLIBUSTA else ProviderType.ZLIBRARY)
    val extension = mutableStateOf(Extension.EPUB)

    var isSearching by mutableStateOf(false)
        private set

    var books by mutableStateOf<List<Book>?>(null)
        private set

    fun searchBooks() {
        if (query.isNotBlank()) {
            isSearching = true

            viewModelScope.launch {
                books = try {
                    searchBooksUseCase(
                        query.trim(),
                        providerType = provider.value,
                        extension = extension.value
                    )
                } catch (e: Exception) {
                    e.printStackTrace()
                    // TODO: add error handling
                    listOf()
                }

                isSearching = false
            }
        }
    }

    fun downloadBook(book: Book) {
        viewModelScope.launch {
            try {
                downloadBookUseCase(book)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun changeQuery(value: String) {
        query = value
        books = null
    }

    fun setProvider(value: ProviderType) {
        if (provider.value != value) {
            provider.value = value
            books = null
        }
    }

    fun setExtension(value: Extension) {
        if (extension.value != value) {
            extension.value = value
            books = null
        }
    }
}
