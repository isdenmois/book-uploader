package com.isdenmois.bookuploader.search.presentation.ui

import androidx.compose.material.AlertDialog
import androidx.compose.material.ButtonDefaults
import androidx.compose.material.Text
import androidx.compose.material.TextButton
import androidx.compose.runtime.Composable
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.domain.model.Book

@Composable
fun ConfirmFileDownloadDialog(
    book: Book,
    onDismissRequest: () -> Unit,
    onRemove: () -> Unit
) {
    val colors = AppTheme.colors

    AlertDialog(
        onDismissRequest = onDismissRequest,
        backgroundColor = colors.background,
        title = {
            Text("Do you really want to download the book \"${book.title}\"?", color = colors.searchText)
        },
        text = {
            Text(book.ext, color = colors.secondary)
        },
        dismissButton = {
            TextButton(
                onClick = onDismissRequest,
                colors = ButtonDefaults.buttonColors(backgroundColor = colors.background)
            ) {
                Text("Dismiss", color = colors.deleteButton)
            }
        },
        confirmButton = {
            TextButton(
                onClick = onRemove,
                colors = ButtonDefaults.buttonColors(backgroundColor = colors.background)
            ) {
                Text("Download", color = colors.error)
            }
        },
    )
}
