package com.isdenmois.bookuploader.domain.usecase.search

import com.isdenmois.bookuploader.core.presentational.item.INDETERMINATED_PROGRESS
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType
import com.isdenmois.bookuploader.domain.repository.BookSearchRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class DownloadBookUseCase @Inject constructor(
    private val bookSearchRepository: BookSearchRepository,
) {
    suspend operator fun invoke(book: Book) {
        book.progress.value = INDETERMINATED_PROGRESS

        val downloadFlow = when (book.type) {
            ProviderType.FLIBUSTA -> bookSearchRepository.downloadFlibustaBook(book)
            ProviderType.FLIBUSTA_TOR -> bookSearchRepository.downloadFlibustaTorBook(book)
            ProviderType.ZLIBRARY -> bookSearchRepository.downloadZLibraryBook(book)
        }

        downloadFlow.collect {
            book.progress.value = it
        }

        book.progress.value = 2f
    }
}
