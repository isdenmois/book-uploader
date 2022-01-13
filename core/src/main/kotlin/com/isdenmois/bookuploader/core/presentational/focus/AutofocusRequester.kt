package com.isdenmois.bookuploader.core.presentational.focus

import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.platform.LocalFocusManager
import androidx.lifecycle.Lifecycle
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.android.awaitFrame
import kotlinx.coroutines.launch

@Composable
fun AutofocusRequester(
    focusRequester: FocusRequester,
    isActive: Boolean = true,
    scope: CoroutineScope = rememberCoroutineScope()
) {
    val focusManager = LocalFocusManager.current
    val focus = {
        if (isActive) {
            scope.launch {
                awaitFrame()
                focusRequester.requestFocus()
            }
        } else {
            focusManager.clearFocus()
        }
    }

    OnLifecycleEvent { event ->
        when (event) {
            Lifecycle.Event.ON_RESUME -> focus()
            Lifecycle.Event.ON_PAUSE -> focusManager.clearFocus()
            else -> {}
        }
    }

    DisposableEffect(isActive) {
        focus()

        onDispose {
            focusManager.clearFocus()
        }
    }
}
