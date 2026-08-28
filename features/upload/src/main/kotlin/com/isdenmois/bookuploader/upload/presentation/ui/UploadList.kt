package com.isdenmois.bookuploader.upload.presentation.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.isdenmois.bookuploader.domain.model.UploadEbook
import com.isdenmois.bookuploader.upload.UploadListViewModel
import kotlinx.coroutines.launch

@Composable
fun UploadList(vm: UploadListViewModel = viewModel()) {
    val toRemove = remember { mutableStateOf<UploadEbook?>(null) }

    val coroutineScope = rememberCoroutineScope()
    val listState = rememberLazyListState()
    val uploadEbook = remember {
        {
            coroutineScope.launch {
                vm.uploadBooks().collect { book ->
                    val index = vm.bookList.value?.indexOf(book) ?: return@collect
                    listState.animateScrollToItem(index = index)
                }
            }
            Unit
        }
    }

    vm.bookList.value?.let { list ->
        Column(modifier = Modifier.fillMaxHeight()) {
            LazyColumn(state = listState, modifier = Modifier.weight(1f)) {
                items(list) { book ->
                    FileItem(
                        ebook = book,
                        selected = book.file.name in vm.selected.value,
                        disabled = vm.uploading.value,
                        onSelect = { vm.toggleBook(book) },
                        onShare = { vm.openEbook(book) },
                        onRemove = { toRemove.value = book },
                    )
                }
            }

            if (list.isNotEmpty() && vm.address.value.isNotBlank()) {
                UploadButton(enabled = !vm.uploading.value, onUpload = uploadEbook)
            }
        }
    }

    val onDismissRequest = { toRemove.value = null }
    val onRemove = {
        toRemove.value?.let { vm.removeBook(it) }
        toRemove.value = null
    }

    toRemove.value?.let { book ->
        ConfirmFileRemoveDialog(book, onDismissRequest, onRemove)
    }
}
