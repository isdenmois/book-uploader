package com.isdenmois.bookuploader.core.presentational.item

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material.LinearProgressIndicator
import androidx.compose.material.ProgressIndicatorDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.isdenmois.bookuploader.core.theme.AppTheme

val INDETERMINATED_PROGRESS = 0.001f

@Composable
fun ItemProgress(progress: State<Float>, progressColor: Color = AppTheme.colors.uploadSelected) {
    val value = progress.value
    val color = if (value >= 1) AppTheme.colors.success else progressColor

    Spacer(modifier = Modifier.height(4.dp))

    when {
        value < 0 -> {
            Spacer(modifier = Modifier.height(ProgressIndicatorDefaults.StrokeWidth))
        }
        value <= INDETERMINATED_PROGRESS -> {
            LinearProgressIndicator(
                color = color,
                backgroundColor = AppTheme.colors.background,
                modifier = Modifier.fillMaxWidth(),
            )
        }
        else -> {
            LinearProgressIndicator(
                color = color,
                backgroundColor = AppTheme.colors.background,
                progress = value.coerceAtMost(1f),
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

@Preview
@Composable
private fun ItemProgressPreview() {
    AppTheme {
        Column {
            ItemProgress(progress = mutableStateOf(-1f))
            ItemProgress(progress = mutableStateOf(0f))
            ItemProgress(progress = mutableStateOf(0.1f))
            ItemProgress(progress = mutableStateOf(0.25f))
            ItemProgress(progress = mutableStateOf(0.5f))
            ItemProgress(progress = mutableStateOf(0.75f))
            ItemProgress(progress = mutableStateOf(1f))
            ItemProgress(progress = mutableStateOf(2f))
        }
    }
}
