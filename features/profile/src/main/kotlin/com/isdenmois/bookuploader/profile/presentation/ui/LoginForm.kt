package com.isdenmois.bookuploader.profile.presentation.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.Icon
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.isdenmois.bookuploader.core.R
import com.isdenmois.bookuploader.core.presentational.Input
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.profile.ProfileViewModel

@Composable
fun LoginForm(vm: ProfileViewModel = viewModel()) {
    val focusManager = LocalFocusManager.current

    Input(
        value = vm.email.value,
        onValueChange = { vm.email.value = it },
        placeholder = "Email",
        enabled = !vm.isLoading.value,
        icon = {
            Icon(
                painter = painterResource(id = R.drawable.ic_email),
                "",
                tint = AppTheme.colors.search
            )
        },
        textColor = AppTheme.colors.profileText,
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
        keyboardActions = KeyboardActions(
            onNext = {
                focusManager.moveFocus(FocusDirection.Next)
            },
        ),
    )

    Spacer(modifier = Modifier.height(16.dp))

    Input(
        value = vm.password.value,
        onValueChange = { vm.password.value = it },
        placeholder = "Email",
        enabled = !vm.isLoading.value,
        icon = {
            Icon(
                painter = painterResource(id = R.drawable.ic_key),
                "",
                tint = AppTheme.colors.search
            )
        },
        textColor = AppTheme.colors.profileText,
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
        keyboardActions = KeyboardActions(
            onSend = {
                focusManager.clearFocus()

                vm.login()
            },
        ),
        visualTransformation = PasswordVisualTransformation(),
    )

    vm.error.value?.let { error ->
        Spacer(modifier = Modifier.height(16.dp))
        Text(text = error, color = AppTheme.colors.error)
    }

    Spacer(modifier = Modifier.height(24.dp))

    Row(
        horizontalArrangement = Arrangement.Center,
        modifier = Modifier.fillMaxWidth(),
    ) {
        ProfileButton(text = "Log in", onClick = vm::login, enabled = !vm.isLoading.value)
    }
}
