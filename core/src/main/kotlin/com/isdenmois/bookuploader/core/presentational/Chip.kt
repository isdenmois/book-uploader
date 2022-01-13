package com.isdenmois.bookuploader.core.presentational

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.isdenmois.bookuploader.core.theme.AppTheme

@Composable
fun Chip(
    title: String,
    selected: Boolean = false,
    disabled: Boolean = false,
    onClick: () -> Unit = {}
) {
    val borderColor: Color
    val backgroundColor: Color
    val textColor: Color
    val alpha: Float = if (disabled) 0.5f else 1f

    if (selected) {
        borderColor = AppTheme.colors.searchSelected
        backgroundColor = AppTheme.colors.searchBackground
        textColor = AppTheme.colors.searchText
    } else {
        borderColor = AppTheme.colors.secondaryBackground
        backgroundColor = Color.Transparent
        textColor = AppTheme.colors.secondary
    }

    Surface(
        shape = RoundedCornerShape(50),
        border = BorderStroke(1.dp, borderColor),
        color = backgroundColor,
        modifier = Modifier
            .clip(RoundedCornerShape(50))
            .alpha(alpha)
            .clickable(onClick = onClick, enabled = !disabled),
    ) {
        Text(
            title,
            color = textColor,
            fontSize = 14.sp,
            lineHeight = 22.sp,
            modifier = Modifier
                .padding(horizontal = 16.dp, vertical = 8.dp)
        )
    }
}

@Preview(showBackground = true)
@Composable
private fun ChipPreview() {
    AppTheme {
        Row(modifier = Modifier.padding(24.dp)) {
            Chip(title = "Chip")

            Spacer(modifier = Modifier.width(16.dp))
            Chip(title = "Selected", selected = true)

            Spacer(modifier = Modifier.width(16.dp))
            Chip(title = "Disabled", disabled = true)
        }
    }
}
