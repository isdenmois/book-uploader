package com.isdenmois.bookuploader.data

import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.data.remote.ZLibraryApi
import com.isdenmois.bookuploader.domain.model.User
import com.isdenmois.bookuploader.domain.repository.UserRepository
import org.json.JSONObject
import javax.inject.Inject

class UserRepositoryImpl @Inject constructor(
    private val zLibraryApi: ZLibraryApi,
    private val preferences: AppPreferences,
) : UserRepository {
    override suspend fun loadProfile(): User {
        val body = zLibraryApi.getProfile(cookie = preferences.zlibAuth.value ?: "")
        val obj = JSONObject(body)

        return User(
            downloads = obj.getInt("dailyDownloads"),
            downloadsLimit = obj.getInt("dailyDownloadsLimit"),
            resetTime = obj.getString("resetTime"),
        )
    }

    override suspend fun login(email: String, password: String): String {
        val response = zLibraryApi.login(
            data = mapOf(
                "isModal" to "true",
                "email" to email,
                "password" to password,
                "site_mode" to "books",
                "action" to "login",
                "isSingleLogin" to "1",
                "redirectUrl" to "",
                "gg_json_mode" to "1",
            )
        )

        val headers = response.headers().toMultimap()
        val cookies = mutableMapOf<String, String>()

        headers.getOrDefault("set-cookie", listOf()).forEach {
            val (key, value) = it.substringBefore(';').split('=')

            cookies[key] = value
        }

        if (cookies.isNotEmpty()) {
            return cookies.entries.joinToString("; ") { (key, value) -> "$key=$value" }
        }

        throw Exception("Can't login")
    }
}
