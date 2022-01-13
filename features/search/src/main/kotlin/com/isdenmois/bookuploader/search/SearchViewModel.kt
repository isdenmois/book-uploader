package com.isdenmois.bookuploader.search

import androidx.compose.runtime.mutableStateOf
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

    val query = mutableStateOf("")
    val provider = mutableStateOf(if (zlibAuth.value.isNullOrBlank()) ProviderType.FLIBUSTA else ProviderType.ZLIBRARY)
    val extension = mutableStateOf(Extension.EPUB)

    var isSearching = mutableStateOf(false)
    var books = mutableStateOf<List<Book>?>(null)

    fun searchBooks() {
        if (query.value.isNotBlank()) {
            isSearching.value = true

            viewModelScope.launch {
                try {
                    books.value = searchBooksUseCase(
                        query.value.trim(),
                        providerType = provider.value,
                        extension = extension.value
                    )
                } catch (e: Exception) {
                    e.printStackTrace()
                    // TODO: add error handling
                    books.value = listOf()
                }

                isSearching.value = false
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

    fun setQuery(value: String) {
        query.value = value
        books.value = null
    }

    fun setProvider(value: ProviderType) {
        if (provider.value != value) {
            provider.value = value
            books.value = null
        }
    }

    fun setExtension(value: Extension) {
        if (extension.value != value) {
            extension.value = value
            books.value = null
        }
    }
}
