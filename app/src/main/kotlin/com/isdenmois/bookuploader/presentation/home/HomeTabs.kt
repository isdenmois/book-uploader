package com.isdenmois.bookuploader.presentation.home

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import com.isdenmois.bookuploader.profile.presentation.ProfileTab
import com.isdenmois.bookuploader.search.presentation.SearchTab
import com.isdenmois.bookuploader.upload.presentation.UploadTab

typealias ComposableFun = @Composable (Boolean) -> Unit

sealed class TabItem(var title: String, var icon: ImageVector, var screen: ComposableFun) {
    object Upload : TabItem("Upload", Icons.Default.Home, { isActive -> UploadTab(isActive = isActive) })
    object Search : TabItem("Search", Icons.Default.Search, { isActive -> SearchTab(isActive = isActive) })
    object Profile : TabItem("Profile", Icons.Default.Person, { isActive -> ProfileTab(isActive = isActive) })
}
