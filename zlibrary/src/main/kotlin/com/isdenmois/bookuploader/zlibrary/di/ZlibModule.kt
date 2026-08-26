package com.isdenmois.bookuploader.zlibrary.di

import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.zlibrary.api.ZlibApi
import com.isdenmois.bookuploader.zlibrary.model.BooklistBooksResponse
import com.isdenmois.bookuploader.zlibrary.model.LoginResponse
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import java.time.Duration
import javax.inject.Named
import javax.inject.Singleton
import okhttp3.HttpLoggingInterceptor
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.scalars.ScalarsConverterFactory

/**
 * Provides only z-library–specific bindings.
 *
 * The module ships its own Moshi/OkHttp instances under the "zlib" qualifiers so it stays
 * self-contained and never clashes with the unqualified bindings exposed by `data/di/ApiModule`.
 */
@Module
@InstallIn(SingletonComponent::class)
object ZlibModule {
    @Singleton
    @Provides
    @Named("zlibMoshi")
    fun provideMoshi(): Moshi = Moshi.Builder()
        .addLast(KotlinJsonAdapterFactory())
        .build()

    @Singleton
    @Provides
    @Named("zlibOkHttpClient")
    fun provideOkHttpClient(config: AppConfig): OkHttpClient = OkHttpClient.Builder()
        .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC })
        .addNetworkInterceptor { chain ->
            chain.proceed(
                chain.request().newBuilder()
                    .header("User-Agent", config.USER_AGENT)
                    .build(),
            )
        }
        .connectTimeout(Duration.ofSeconds(60))
        .readTimeout(Duration.ofSeconds(60))
        .build()

    @Singleton
    @Provides
    @Named("zlibMirror")
    fun provideMirror(config: AppConfig): String {
        val host = config.ZLIB_HOST.trim()
        return if (host.startsWith("http")) host.trimEnd('/') else "https://$host".trimEnd('/')
    }

    @Singleton
    @Provides
    fun provideZlibApi(
        @Named("zlibOkHttpClient") okHttpClient: OkHttpClient,
        @Named("zlibMirror") mirror: String,
    ): ZlibApi =
        Retrofit.Builder()
            .baseUrl("$mirror/")
            .addConverterFactory(ScalarsConverterFactory.create())
            .client(okHttpClient)
            .build()
            .create(ZlibApi::class.java)

    @Singleton
    @Provides
    fun provideBooklistBooksAdapter(@Named("zlibMoshi") moshi: Moshi): JsonAdapter<BooklistBooksResponse> =
        moshi.adapter(BooklistBooksResponse::class.java)

    @Singleton
    @Provides
    fun provideLoginResponseAdapter(@Named("zlibMoshi") moshi: Moshi): JsonAdapter<LoginResponse> =
        moshi.adapter(LoginResponse::class.java)
}
