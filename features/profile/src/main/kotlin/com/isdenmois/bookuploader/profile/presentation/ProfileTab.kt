package com.isdenmois.bookuploader.profile.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.profile.ProfileViewModel
import com.isdenmois.bookuploader.profile.presentation.ui.LoginForm
import com.isdenmois.bookuploader.profile.presentation.ui.UserProfile

@Composable
fun ProfileTab(isActive: Boolean, vm: ProfileViewModel = viewModel()) {
    LaunchedEffect(isActive) {
        if (isActive) {
            vm.loadProfileInfo()
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(top = 16.dp)) {
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Text("Profile", color = AppTheme.colors.profileText, style = MaterialTheme.typography.h5)
        }

        Column(
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .fillMaxWidth()
                .weight(1f),
        ) {
            if (vm.zlibAuth.value.isNullOrBlank()) {
                LoginForm(vm)
            } else {
                UserProfile(vm)
            }
        }
    }
}
