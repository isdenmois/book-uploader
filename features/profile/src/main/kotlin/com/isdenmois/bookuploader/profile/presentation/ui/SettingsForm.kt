package com.isdenmois.bookuploader.profile.presentation.ui

import androidx.compose.material.SwitchDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewmodel.compose.viewModel
import com.isdenmois.bookuploader.core.presentational.SwitchRow
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.profile.ProfileViewModel

@Composable
fun SettingsForm(vm: ProfileViewModel = viewModel()) {
    val useDirectDownloads by vm.useDirectDownloads
    val showFlibustaFirst by vm.showFlibustaFirst

    val colors = SwitchDefaults.colors(
        checkedThumbColor = AppTheme.colors.profileSelected,
        checkedTrackColor = AppTheme.colors.profileBackground,
        uncheckedThumbColor = AppTheme.colors.secondary,
        uncheckedTrackColor = AppTheme.colors.secondaryBackground,
    )

    SwitchRow(
        text = "Direct downloads",
        textColor = AppTheme.colors.profileText,
        colors = colors,
        checked = useDirectDownloads,
        onCheckedChange = {
            vm.setUseDirectDownloads(it)
        }
    )

    SwitchRow(
        text = "Show Flibusta first",
        textColor = AppTheme.colors.profileText,
        colors = colors,
        checked = showFlibustaFirst,
        onCheckedChange = {
            vm.toggleShowFlibustaFirst(it)
        }
    )
}
