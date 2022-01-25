package com.isdenmois.bookuploader.search.presentation.ui

import android.util.Log
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.isdenmois.bookuploader.core.Extension
import com.isdenmois.bookuploader.core.presentational.Chip
import com.isdenmois.bookuploader.domain.model.ProviderType
import com.isdenmois.bookuploader.search.SearchViewModel

@Composable
fun SearchFilters(vm: SearchViewModel = viewModel()) {
    val zlibAuth by vm.zlibAuth
    val provider by vm.provider
    val extension by vm.extension
    val isSearching = vm.isSearching

    Log.d("SearchFilters", "change")

    Row(
        modifier = Modifier
            .padding(top = 24.dp)
            .horizontalScroll(rememberScrollState()),
    ) {
        Chip(
            title = "ZLibrary",
            selected = provider == ProviderType.ZLIBRARY,
            onClick = { vm.setProvider(ProviderType.ZLIBRARY) },
            disabled = isSearching || zlibAuth.isNullOrBlank()
        )
        Spacer(modifier = Modifier.width(16.dp))
        Chip(
            title = "Flibusta",
            selected = provider == ProviderType.FLIBUSTA,
            onClick = { vm.setProvider(ProviderType.FLIBUSTA) },
            disabled = isSearching
        )

        Spacer(modifier = Modifier.width(32.dp))

        if (provider == ProviderType.ZLIBRARY) {
            Chip(
                title = "EPUB",
                selected = extension == Extension.EPUB,
                onClick = { vm.setExtension(Extension.EPUB) },
                disabled = isSearching
            )
            Spacer(modifier = Modifier.width(16.dp))
            Chip(
                title = "FB2",
                selected = extension == Extension.FB2,
                onClick = { vm.setExtension(Extension.FB2) },
                disabled = isSearching
            )
        }
    }
}
