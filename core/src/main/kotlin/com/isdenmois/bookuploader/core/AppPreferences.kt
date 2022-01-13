package com.isdenmois.bookuploader.core

import android.content.Context
import android.content.SharedPreferences
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AppPreferences @Inject constructor(
    @ApplicationContext private val context: Context,
    private val preferences: SharedPreferences,
) {
    private val upload_base_url_key = context.getString(R.string.upload_base_url_key)
    private val zlib_auth_key = context.getString(R.string.zlib_auth_key)

    private val _uploadUrl = mutableStateOf(getInitialUploadUrl() ?: "")
    val uploadUrl: State<String> = _uploadUrl

    private val _zlibAuth = mutableStateOf(getInitialAuth())
    val zlibAuth: State<String?> = _zlibAuth

    private fun getInitialUploadUrl() = preferences.getString(upload_base_url_key, null)

    private fun getInitialAuth(): String? {
        val value = preferences.getString(zlib_auth_key, null)

        if (value.isNullOrBlank()) {
            return null
        }

        return value
    }

    fun setUploadUrl(url: String) {
        preferences.setString(upload_base_url_key, url)
        _uploadUrl.value = url
    }

    fun setZlibAuth(cookie: String?) {
        preferences.setString(zlib_auth_key, cookie)
        _zlibAuth.value = cookie ?: ""
    }
}

fun SharedPreferences.setString(key: String, value: String?) {
    with(edit()) {
        if (value.isNullOrBlank()) {
            remove(key)
        } else {
            putString(key, value)
        }

        apply()
    }
}
