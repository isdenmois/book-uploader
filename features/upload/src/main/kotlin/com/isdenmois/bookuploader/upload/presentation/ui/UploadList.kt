package com.isdenmois.bookuploader.upload.presentation.ui

import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
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
                vm.uploadBooks().collect {
                    listState.animateScrollToItem(index = it)
                }
            }
            Unit
        }
    }

    vm.bookList.value?.let { list ->
        LazyColumn(state = listState) {
            items(list) { book ->
                FileItem(
                    ebook = book,
                    disabled = vm.uploading.value,
                    onShare = { vm.openEbook(book) },
                    onRemove = { toRemove.value = book },
                )
            }

            item {
                if (!vm.uploading.value && list.isNotEmpty() && vm.address.value.isNotBlank()) {
                    UploadButton(onUpload = uploadEbook)
                }
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
