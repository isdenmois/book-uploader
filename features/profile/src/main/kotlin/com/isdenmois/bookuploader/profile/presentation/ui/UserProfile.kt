package com.isdenmois.bookuploader.profile.presentation.ui

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.LinearProgressIndicator
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.profile.ProfileViewModel

@Composable
fun UserProfile(vm: ProfileViewModel) {
    val user by vm.user
    val downloads = user?.downloads ?: 0
    val downloadsLimit = user?.downloadsLimit ?: 1
    val resetTime = if (user?.resetTime.isNullOrBlank()) "" else "(${user!!.resetTime})"

    Text(text = "Daily downloads $resetTime", color = AppTheme.colors.profileText)

    Spacer(modifier = Modifier.height(8.dp))

    if (vm.isLoading.value) {
        CircularProgressIndicator(color = AppTheme.colors.profileSelected)
    } else {
        Row(verticalAlignment = Alignment.CenterVertically) {
            LinearProgressIndicator(
                progress = downloads.toFloat() / downloadsLimit,
                color = AppTheme.colors.profileSelected,
                backgroundColor = AppTheme.colors.secondaryBackground,
                modifier = Modifier
                    .weight(1f)
                    .height(8.dp),
            )

            Spacer(modifier = Modifier.width(8.dp))

            Text("$downloads / $downloadsLimit", color = AppTheme.colors.profileText)
        }

        Spacer(modifier = Modifier.height(16.dp))

        ProfileButton(text = "Log out", onClick = vm::logout, enabled = !vm.isLoading.value)
    }
}
