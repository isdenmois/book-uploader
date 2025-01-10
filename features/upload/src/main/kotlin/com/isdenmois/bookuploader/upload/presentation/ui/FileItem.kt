package com.isdenmois.bookuploader.upload.presentation.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.material.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import com.isdenmois.bookuploader.core.R
import com.isdenmois.bookuploader.core.presentational.FileCover
import com.isdenmois.bookuploader.core.presentational.ImageCover
import com.isdenmois.bookuploader.core.presentational.getExt
import com.isdenmois.bookuploader.core.presentational.item.Item
import com.isdenmois.bookuploader.core.presentational.item.ItemProgress
import com.isdenmois.bookuploader.core.presentational.item.ItemText
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.domain.model.UploadEbook
import java.io.File

@Composable
fun FileItem(ebook: UploadEbook, disabled: Boolean, onShare: () -> Unit, onRemove: () -> Unit) {
    Item(onClick = onShare, disabled = disabled, progress = { ItemProgress(progress = ebook.progress) }) {
        if (ebook.cover !== null) {
            ImageCover(bitmap = ebook.cover!!, type = getExt(ebook.file))
        } else {
            FileCover(file = ebook.file)
        }

        val subTitle = if (ebook.file.name != ebook.title) ebook.file.name else null

        ItemText(title = ebook.title, supTitle = ebook.author, subTitle = subTitle, error = ebook.error.value)

        if (!disabled && ebook.file.exists()) {
            IconButton(onClick = onRemove) {
                Image(painter = painterResource(id = R.drawable.ic_times), contentDescription = "Remove")
            }
        }
    }
}

@Preview
@Composable
private fun FileItemPreview() {
    AppTheme {
        Column {
            FileItem(
                ebook = UploadEbook(title = "Harry Potter", author = "Some Person", file = File("/tmp/h1.epub")),
                disabled = false,
                onShare = {},
                onRemove = {},
            )
            FileItem(
                ebook = UploadEbook(title = "Harry Potter", file = File("/tmp/hp.fb2")),
                disabled = false,
                onShare = {},
                onRemove = {},
            )

            val withProgress = UploadEbook(title = "Harry Potter", author = "Some Person", file = File("/tmp/hp.pdf"))
            withProgress.progress.value = 0.5f

            FileItem(
                ebook = withProgress,
                disabled = false,
                onShare = {},
                onRemove = {},
            )
        }
    }
}
