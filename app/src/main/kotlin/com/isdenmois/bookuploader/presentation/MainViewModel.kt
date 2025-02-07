package com.isdenmois.bookuploader.presentation

import androidx.compose.foundation.pager.PagerState
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

    val pagerState = PagerState {
        tabs.size
    }

    suspend fun scrollToTab(tabItem: TabItem) {
        val index = tabs.indexOf(tabItem)

        pagerState.scrollToPage(index)
    }
}
