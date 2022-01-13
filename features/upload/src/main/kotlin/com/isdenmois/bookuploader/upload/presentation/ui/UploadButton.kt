package com.isdenmois.bookuploader.upload.presentation.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
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
fun UploadButton(onUpload: () -> Unit) {
    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Button(
            onClick = { onUpload(); },
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(backgroundColor = AppTheme.colors.uploadSelected),
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Start Upload", color = Color.White)
        }
    }
}
