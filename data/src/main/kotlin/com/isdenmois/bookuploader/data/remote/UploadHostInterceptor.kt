package com.isdenmois.bookuploader.data.remote

import com.isdenmois.bookuploader.core.AppPreferences
import java.net.URISyntaxException
import javax.inject.Inject
import javax.inject.Singleton
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.Interceptor
import okhttp3.Response

@Singleton
class UploadHostInterceptor @Inject constructor(
    private val preferences: AppPreferences,
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        var request = chain.request()
        val host = preferences.uploadUrl.value.toHttpUrlOrNull()

        if (host != null) {
            var newUrl: HttpUrl? = null
            try {
                newUrl = request.url.newBuilder()
                    .scheme(host.scheme)
                    .host(host.host)
                    .port(host.port)
                    .build()
            } catch (e: URISyntaxException) {
                e.printStackTrace()
            }
            assert(newUrl != null)
            request = request.newBuilder()
                .url(newUrl!!)
                .build()
        }

        return chain.proceed(request)
    }
}
