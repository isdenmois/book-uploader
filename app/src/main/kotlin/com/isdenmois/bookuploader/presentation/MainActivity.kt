package com.isdenmois.bookuploader.presentation

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.lifecycleScope
import com.google.accompanist.pager.ExperimentalPagerApi
import com.google.accompanist.pager.PagerState
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.data.ActivityResultManager
import com.isdenmois.bookuploader.data.ActivityRunner
import com.isdenmois.bookuploader.presentation.home.HomeContent
import com.isdenmois.bookuploader.presentation.home.TabItem
import com.isdenmois.bookuploader.search.SearchViewModel
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@ExperimentalPagerApi
@AndroidEntryPoint
class MainActivity : ComponentActivity(), ActivityRunner {
    private val searchViewModel: SearchViewModel by viewModels()
    private val mainViewModel: MainViewModel by viewModels()

    @Inject
    lateinit var activityResultManager: ActivityResultManager

    private lateinit var pagerState: PagerState

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        activityResultManager.setRunner(this)

        val query = getQuery(intent)

        if (query.isNotBlank()) {
            searchViewModel.query = getQuery(intent)
        }

        val searchTabIndex = mainViewModel.tabs.indexOf(TabItem.Search)

        pagerState = PagerState(
            currentPage = if (searchViewModel.query.isNotBlank()) searchTabIndex else 0,
        )

        setContent {
            AppTheme {
                Surface(color = AppTheme.colors.background, modifier = Modifier.fillMaxSize()) {
                    HomeContent(pagerState = pagerState)
                }
            }
        }
        reportFullyDrawn()
    }

    override fun runActivity(intent: Intent, id: Int) {
        startActivityForResult(intent, id)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        activityResultManager.onResult(requestCode, resultCode, data)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)

        val searchTabIndex = mainViewModel.tabs.indexOf(TabItem.Search)
        val query = getQuery(intent)

        if (query.isNotBlank()) {
            searchViewModel.query = query

            lifecycleScope.launchWhenResumed {
                pagerState.scrollToPage(searchTabIndex)
            }
        }
    }

    private fun getQuery(intent: Intent?) = intent?.dataString?.replace("booksearch://", "") ?: ""
}
