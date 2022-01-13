package com.isdenmois.bookuploader.domain.usecase.search

import com.isdenmois.bookuploader.core.Extension
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType
import com.isdenmois.bookuploader.domain.repository.BookSearchRepository
import javax.inject.Inject

class SearchBooksUseCase @Inject constructor(
    private val bookSearchRepository: BookSearchRepository,
) {
    suspend operator fun invoke(
        query: String,
        providerType: ProviderType = ProviderType.FLIBUSTA,
        extension: Extension? = null
    ): List<Book> {
        return when (providerType) {
            ProviderType.FLIBUSTA -> bookSearchRepository.searchBooksInFlibusta(query)
            ProviderType.ZLIBRARY -> bookSearchRepository.searchBooksInZLibrary(query, extension ?: Extension.EPUB)
        }
    }
}
