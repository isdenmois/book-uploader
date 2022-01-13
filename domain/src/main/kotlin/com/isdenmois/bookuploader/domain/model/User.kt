package com.isdenmois.bookuploader.domain.model

data class User(
    val downloads: Int,
    val downloadsLimit: Int,
    val resetTime: String,
)
