package com.isdenmois.bookuploader.profile.presentation.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.isdenmois.bookuploader.core.theme.AppTheme

@Composable
fun ProfileButton(text: String, onClick: () -> Unit, enabled: Boolean) {
    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Button(
            onClick = onClick,
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(
                backgroundColor = AppTheme.colors.profileSelected,
                disabledBackgroundColor = AppTheme.colors.profileSelected.copy(alpha = 0.6f)
            ),
            enabled = enabled,
        ) {
            Text(text, color = Color.White)
        }
    }
}
