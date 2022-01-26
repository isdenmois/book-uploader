package com.isdenmois.bookuploader.search.presentation

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.isdenmois.bookuploader.core.presentational.Input
import com.isdenmois.bookuploader.core.presentational.focus.AutofocusRequester
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.search.R
import com.isdenmois.bookuploader.search.SearchViewModel
import com.isdenmois.bookuploader.search.presentation.ui.BookList
import com.isdenmois.bookuploader.search.presentation.ui.ConfirmFileDownloadDialog
import com.isdenmois.bookuploader.search.presentation.ui.SearchFilters

@Composable
fun SearchTab(isActive: Boolean = false) {
    val vm: SearchViewModel = viewModel()
    val isSearching = vm.isSearching

    val focusRequester = remember { FocusRequester() }
    var toDownload by remember { mutableStateOf<Book?>(null) }

    AutofocusRequester(focusRequester = focusRequester, isActive = isActive)

    LaunchedEffect(vm.extension.value, vm.provider.value) {
        focusRequester.requestFocus()
    }

    Column(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            val focusManager = LocalFocusManager.current

            Input(
                value = vm.query,
                onValueChange = vm::changeQuery,
                placeholder = "Search by title",
                enabled = !isSearching,
                icon = {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_search),
                        "",
                        tint = AppTheme.colors.search
                    )
                },
                textColor = AppTheme.colors.searchText,
                focusRequester = focusRequester,
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(
                    onSearch = {
                        focusManager.clearFocus()
                        vm.searchBooks()
                    }
                ),
            )

            SearchFilters()
        }

        BookList(books = vm.books, isLoading = isSearching, onDownload = { toDownload = it })
    }

    val onDismissRequest = { toDownload = null }
    val onRemove = {
        toDownload?.let { vm.downloadBook(it) }
        toDownload = null
    }

    toDownload?.let { book ->
        ConfirmFileDownloadDialog(book, onDismissRequest, onRemove)
    }
}
