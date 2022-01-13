package com.isdenmois.bookuploader.core.presentational

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.isdenmois.bookuploader.core.R
import java.io.File

@Composable
fun FileCover(file: File, size: Dp = 60.dp, width: Dp? = 48.dp) {
    FileCover(ext = getExt(file), size = size, width = width)
}

@Composable
fun FileCover(ext: String, size: Dp = 60.dp, width: Dp? = 48.dp, colorFilter: ColorFilter? = null) {
    val widthSize = width ?: size.times(0.8f)

    Box {
        Image(
            painterResource(R.drawable.ic_file),
            contentDescription = ext,
            modifier = Modifier
                .height(size)
                .width(widthSize),
            contentScale = ContentScale.FillBounds,
            colorFilter = colorFilter,
        )

        Text(
            text = ext.uppercase(),
            color = Color.White,
            textAlign = TextAlign.Center,
            fontWeight = FontWeight.Bold,
            fontSize = 12.sp,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 4.dp)
        )
    }
}

fun getExt(file: File): String {
    if (file.extension == "zip") {
        val name = file.name.replace(".zip", "")

        return name.substring(name.lastIndexOf('.') + 1)
    }

    return file.extension
}

@Preview
@Composable
private fun FileCoverPreview() {
    Column {
        FileCover(ext = "fb2")
        FileCover(ext = "epub")
        FileCover(ext = "pdf")
        FileCover(ext = "mobi")
    }
}
