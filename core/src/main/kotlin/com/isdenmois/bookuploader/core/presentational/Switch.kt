package com.isdenmois.bookuploader.core.presentational

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.Switch
import androidx.compose.material.SwitchColors
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp

@Composable
fun SwitchRow(text: String, textColor: Color, colors: SwitchColors, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Row(
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth().clickable {
            onCheckedChange(!checked)
        },
    ) {
        Text(
            text = text,
            color = textColor,
            fontSize = 16.sp,
            textAlign = TextAlign.Center
        )

        Switch(
            colors = colors,
            checked = checked,
            onCheckedChange = onCheckedChange
        )
    }
}
