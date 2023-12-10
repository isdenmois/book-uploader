package com.isdenmois.bookuploader.presentation.home

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.padding
import androidx.compose.material.Scaffold
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Search
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.isdenmois.bookuploader.core.presentational.NavBar
import com.isdenmois.bookuploader.core.presentational.NavItem
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.upload.UploadListViewModel
import com.google.accompanist.pager.ExperimentalPagerApi
import com.google.accompanist.pager.HorizontalPager
import com.google.accompanist.pager.PagerState
import com.isdenmois.bookuploader.presentation.MainViewModel
import kotlinx.coroutines.launch

@ExperimentalPagerApi
@Composable
fun HomeContent(pagerState: PagerState) {
    val vm: UploadListViewModel = viewModel()
    val mainVm: MainViewModel = viewModel()

    LaunchedEffect(pagerState.currentPage) {
        if (mainVm.tabs[pagerState.currentPage] == TabItem.Upload) {
            vm.loadBookList()
        }
    }

    Scaffold(
        backgroundColor = AppTheme.colors.background,
        bottomBar = {
            Tabs(pagerState = pagerState, tabs = mainVm.tabs)
        }
    ) {
        Column(modifier = Modifier.padding(it)) {
            TabsContent(pagerState = pagerState, tabs = mainVm.tabs)
        }
    }
}

@ExperimentalPagerApi
@Composable
fun Tabs(pagerState: PagerState, tabs: List<TabItem>) {
    val scope = rememberCoroutineScope()

    HomeNavBar(
        tabs = tabs,
        selected = pagerState.targetPage,
        onChange = remember {
            { index ->
                scope.launch {
                    pagerState.animateScrollToPage(index)
                }
            }
        },
    )
}

@Composable
fun HomeNavBar(tabs: List<TabItem>, selected: Int, onChange: (Int) -> Unit) {
    val colors = AppTheme.colors
    val items = remember(colors) {
        val backgroundColors = mapOf(
            TabItem.Upload to colors.uploadBackground,
            TabItem.Search to colors.searchBackground,
            TabItem.Profile to colors.profileBackground,
        )
        val textColors = mapOf(
            TabItem.Upload to colors.uploadText,
            TabItem.Search to colors.searchText,
            TabItem.Profile to colors.profileText,
        )
        tabs.map {
            NavItem(
                label = it.title,
                icon = it.icon,
                backgroundColor = backgroundColors[it] ?: colors.uploadText,
                textColor = textColors[it] ?: colors.uploadText,
                )
        }
    }

    NavBar(items = items, selected = selected, onChange = onChange)
}

@ExperimentalPagerApi
@Composable
fun TabsContent(pagerState: PagerState, tabs: List<TabItem>) {
    HorizontalPager(state = pagerState, count = tabs.size) { page ->
        Column(modifier = Modifier.fillMaxHeight()) {
            tabs[page].screen(page == pagerState.currentPage)
        }
    }
}
