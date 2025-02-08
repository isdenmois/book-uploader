package com.isdenmois.bookuploader.presentation

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.material.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.lifecycleScope
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.presentation.home.HomeContent
import com.isdenmois.bookuploader.presentation.home.TabItem
import com.isdenmois.bookuploader.search.SearchViewModel
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    private val searchViewModel: SearchViewModel by viewModels()
    private val mainViewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        lifecycleScope.launch {
            handleSearchQuery(intent)
        }

        setContent {
            AppTheme {
                Surface(
                    color = AppTheme.colors.background,
                    modifier = Modifier
                        .fillMaxSize()
                        .safeDrawingPadding()
                ) {
                    HomeContent(pagerState = mainViewModel.pagerState)
                }
            }
        }
        reportFullyDrawn()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)

        lifecycleScope.launch {
            handleSearchQuery(intent)
        }
    }

    private suspend fun handleSearchQuery(intent: Intent) {
        val query = getQuery(intent)

        if (query.isNotBlank()) {
            searchViewModel.query = query
            mainViewModel.scrollToTab(TabItem.Search)
        }
    }

    private fun getQuery(intent: Intent?) = intent?.dataString?.replace("booksearch://", "") ?: ""
}
