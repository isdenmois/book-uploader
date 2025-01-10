package com.isdenmois.bookuploader.domain.model

import androidx.compose.runtime.mutableStateOf

data class Book(
    val id: String,
    val type: ProviderType,
    val ext: String,
    val link: String,
    val title: String,
    val authors: String? = null,
    val translation: String? = null,
    val language: String? = null,
    val series: String? = null,
    val size: String? = null,
    val cover: String? = null,
) {
    val progress = mutableStateOf(-1f)
}
