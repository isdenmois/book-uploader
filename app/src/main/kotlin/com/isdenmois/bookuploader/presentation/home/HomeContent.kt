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
import kotlinx.coroutines.launch

val tabs = listOf(TabItem.Upload, TabItem.Search, TabItem.Profile)

@ExperimentalPagerApi
@Composable
fun HomeContent(pagerState: PagerState) {
    val vm: UploadListViewModel = viewModel()

    LaunchedEffect(pagerState.currentPage) {
        if (pagerState.currentPage == 0) {
            vm.loadBookList()
        }
    }

    Scaffold(
        backgroundColor = AppTheme.colors.background,
        bottomBar = {
            Tabs(pagerState = pagerState)
        }
    ) {
        Column(modifier = Modifier.padding(it)) {
            TabsContent(pagerState = pagerState)
        }
    }
}

@ExperimentalPagerApi
@Composable
fun Tabs(pagerState: PagerState) {
    val scope = rememberCoroutineScope()

    HomeNavBar(
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
fun HomeNavBar(selected: Int, onChange: (Int) -> Unit) {
    val colors = AppTheme.colors
    val items = remember(colors) {
        listOf(
            NavItem("Upload", Icons.Outlined.Home, colors.uploadBackground, colors.uploadText),
            NavItem("Search", Icons.Outlined.Search, colors.searchBackground, colors.searchText),
            NavItem("Profile", Icons.Outlined.Person, colors.profileBackground, colors.profileText),
        )
    }

    NavBar(items = items, selected = selected, onChange = onChange)
}

@ExperimentalPagerApi
@Composable
fun TabsContent(pagerState: PagerState) {
    HorizontalPager(state = pagerState, count = tabs.size) { page ->
        Column(modifier = Modifier.fillMaxHeight()) {
            tabs[page].screen(page == pagerState.currentPage)
        }
    }
}
