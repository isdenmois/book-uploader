package com.isdenmois.bookuploader.data

import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.data.remote.TorApi
import com.isdenmois.bookuploader.domain.model.User
import com.isdenmois.bookuploader.domain.repository.UserRepository
import java.util.regex.Pattern
import javax.inject.Inject
import org.json.JSONObject

class UserRepositoryImpl @Inject constructor(
    private val torApi: TorApi,
    private val preferences: AppPreferences,
    private val config: AppConfig,
) : UserRepository {
    override suspend fun loadProfile(): User {
        val body = torApi.textRequest(
            host = config.ZLIB_HOST,
            path = "/papi/user/dstats",
            cookie = preferences.zlibAuth.value,
        )
        val obj = JSONObject(body)

        return User(
            downloads = obj.getInt("dailyDownloads"),
            downloadsLimit = obj.getInt("dailyDownloadsLimit"),
            resetTime = obj.getString("resetTime"),
        )
    }

    override suspend fun login(email: String, password: String): String {
        val body = torApi.postForm(
            host = config.ZLIB_HOST,
            path = "/rpc.php",
            body = mapOf("email" to email, "password" to password, "action" to "login")
        )
        val matcher = COOKIE_REGEXP.matcher(body)
        var cookie: String? = null

        if (matcher.find()) {
            cookie = matcher.group(1)
        }

        if (cookie != null) {
            return cookie.replace("&", "; ")
        }

        throw Exception("Can't login")
    }

    companion object {
        val COOKIE_REGEXP = "onion/?\\?(.*?)\"".toPattern(Pattern.CASE_INSENSITIVE)
    }
}
