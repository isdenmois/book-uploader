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
    private val initial_search_engine_key = "initial_search_engine"
    private val use_direct_downloads = "use_direct_downloads"

    private val _uploadUrl = mutableStateOf(getInitialUploadUrl() ?: "")
    val uploadUrl: State<String> = _uploadUrl

    private val _zlibAuth = mutableStateOf(getInitialAuth())
    val zlibAuth: State<String?> = _zlibAuth

    private val _useDirectDownloads = mutableStateOf(preferences.getBoolean(use_direct_downloads, false))
    val useDirectDownloads: State<Boolean> = _useDirectDownloads

    private val _initialSearchEngine = mutableStateOf(getInitialSearchEngine() ?: "flibusta")
    val initialSearchEngine: State<String> = _initialSearchEngine

    private fun getInitialUploadUrl() = preferences.getString(upload_base_url_key, null)

    private fun getInitialSearchEngine() = preferences.getString(initial_search_engine_key, null)

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

    fun setInitialSearchEngine(engine: String) {
        preferences.setString(initial_search_engine_key, engine)
        _initialSearchEngine.value = engine
    }

    fun setUseDirectDownloads(value: Boolean) {
        preferences.setBoolean(use_direct_downloads, value)
        _useDirectDownloads.value = value
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

fun SharedPreferences.setBoolean(key: String, value: Boolean) {
    with(edit()) {
        putBoolean(key, value)

        apply()
    }
}
