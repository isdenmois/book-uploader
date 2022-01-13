package com.isdenmois.bookuploader.search.presentation.ui

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.tooling.preview.Preview
import com.isdenmois.bookuploader.core.presentational.FileCover
import com.isdenmois.bookuploader.core.presentational.ImageCover
import com.isdenmois.bookuploader.core.presentational.item.Item
import com.isdenmois.bookuploader.core.presentational.item.ItemText
import com.isdenmois.bookuploader.core.presentational.item.ItemProgress
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType

@Composable
fun BookItem(book: Book, onClick: (book: Book) -> Unit) {
    val other = listOf(book.size, book.language, book.translation).filter { it != null }
        .joinToString()
    val extension = book.ext.replace(".zip", "")

    Item(
        onClick = { onClick(book) },
        progress = { ItemProgress(progress = book.progress, progressColor = AppTheme.colors.searchSelected) }
    ) {
        when (book.cover) {
            null -> FileCover(ext = extension, colorFilter = ColorFilter.tint(AppTheme.colors.searchSelected))
            else -> ImageCover(url = book.cover!!, type = extension)
        }

        ItemText(supTitle = book.authors, title = book.title, subTitle = other)
    }
}

@Preview(showBackground = true)
@Composable
private fun BookItemPreview() {
    AppTheme {
        BookItem(
            book = Book(
                "1",
                ProviderType.FLIBUSTA,
                "fb2",
                "",
                "Anna Karenina",
                "Lev Tolstoy",
                null,
                null,
                "140KB"
            ),
            onClick = {}
        )
    }
}
