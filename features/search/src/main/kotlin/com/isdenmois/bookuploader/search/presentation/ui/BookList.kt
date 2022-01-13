package com.isdenmois.bookuploader.search.presentation.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.model.ProviderType

@Composable
fun ColumnScope.BookList(books: List<Book>?, isLoading: Boolean, onDownload: (item: Book) -> Unit) {
    if (isLoading) {
        Column(
            modifier = Modifier.weight(1f).align(Alignment.CenterHorizontally),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            CircularProgressIndicator(color = AppTheme.colors.searchSelected)
        }
        return
    }

    if (books === null) {
        Column(
            modifier = Modifier.weight(1f).align(Alignment.CenterHorizontally),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            // TODO: image
            Text(
                "Start search books to see a result",
                color = AppTheme.colors.search,
                fontSize = 16.sp,
                textAlign = TextAlign.Center
            )
        }
        return
    }

    if (books.isEmpty()) {
        Column(
            modifier = Modifier.weight(1f).align(Alignment.CenterHorizontally),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            // TODO: image
            Text(
                "Nothing has found",
                color = AppTheme.colors.search,
                fontSize = 20.sp,
                textAlign = TextAlign.Center
            )
        }
        return
    }

    LazyColumn {
        items(books) { book ->
            BookItem(book = book, onClick = onDownload)
        }
    }
}

@Preview
@Composable
private fun BookListLoadingPreview() {
    AppTheme {
        Column {
            BookList(books = null, isLoading = true, onDownload = {})
        }
    }
}

@Preview
@Composable
private fun BookListNullPreview() {
    AppTheme {
        Column {
            BookList(books = null, isLoading = false, onDownload = {})
        }
    }
}

@Preview
@Composable
private fun BookListEmptyPreview() {
    AppTheme {
        Column {
            BookList(books = listOf(), isLoading = false, onDownload = {})
        }
    }
}

@Preview
@Composable
private fun BookListPreview() {
    val books = listOf(
        Book(
            "1",
            ProviderType.FLIBUSTA,
            "fb2",
            "",
            "Anna Karenina",
            authors = "Lev Tolstoy",
            null,
            null,
            null
        ),
        Book(
            "2",
            ProviderType.FLIBUSTA,
            "fb2",
            "",
            "Эрагон",
            authors = "Паолини Чаполини",
            "Пукин",
            null,
            "200KB"
        ),
        Book(
            "3",
            ProviderType.FLIBUSTA,
            "fb2",
            "",
            "Наследие",
            authors = "Паолини Чаполини",
            "Пукин",
            null,
            "321KB"
        ),
    )

    AppTheme {
        Column {
            BookList(books = books, isLoading = false, onDownload = {})
        }
    }
}
