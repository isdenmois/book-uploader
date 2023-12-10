package com.isdenmois.bookuploader.presentation

import androidx.lifecycle.ViewModel
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.presentation.home.TabItem
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    appPreferences: AppPreferences,
): ViewModel() {
    val tabs = if (appPreferences.useDirectDownloads.value)
        listOf(TabItem.Search, TabItem.Profile)
    else
        listOf(TabItem.Upload, TabItem.Search, TabItem.Profile)
}
