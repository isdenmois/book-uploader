package com.isdenmois.bookuploader.core.presentational

import android.graphics.Bitmap
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.painter.BitmapPainter
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberImagePainter
import com.isdenmois.bookuploader.core.theme.AppTheme

@Composable
fun ImageCover(bitmap: Bitmap, type: String) {
    ImageCover(painter = remember(bitmap) { BitmapPainter(bitmap.asImageBitmap()) }, type = type)
}

@Composable
fun ImageCover(url: String, type: String) {
    ImageCover(painter = rememberImagePainter(url), type = type)
}

@Composable
fun ImageCover(painter: Painter, type: String) {
    val colors = AppTheme.colors

    Box(modifier = Modifier.clip(RoundedCornerShape(4.dp))) {
        Image(
            painter = painter,
            contentDescription = type,
            modifier = Modifier.width(48.dp).height(60.dp),
            contentScale = ContentScale.FillWidth,
        )

        Text(
            type.uppercase(),
            color = Color.White,
            textAlign = TextAlign.Center,
            fontWeight = FontWeight.Bold,
            fontSize = 12.sp,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .width(48.dp)
                .background(color = colors.searchSelected)
        )
    }
}
