package com.isdenmois.bookuploader.data.di

import android.content.Context
import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.data.remote.TorApi
import com.isdenmois.bookuploader.data.remote.UploadApi
import com.isdenmois.bookuploader.data.remote.UploadHostInterceptor
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import java.time.Duration
import javax.inject.Named
import javax.inject.Singleton
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.scalars.ScalarsConverterFactory

@Module
@InstallIn(SingletonComponent::class)
object ApiModule {
    @Singleton
    @Provides
    fun provideUploadApi(uploadHostInterceptor: UploadHostInterceptor): UploadApi {
        val builder = OkHttpClient.Builder()

        val okHttpClient = builder.addInterceptor(uploadHostInterceptor).build()

        return Retrofit.Builder()
            .baseUrl("http://localhost")
            .addConverterFactory(ScalarsConverterFactory.create())
            .client(okHttpClient)
            .build()
            .create(UploadApi::class.java)
    }

    @Singleton
    @Provides
    fun provideTorApi(config: AppConfig): TorApi {
        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(
                HttpLoggingInterceptor().apply {
                    level = HttpLoggingInterceptor.Level.BASIC
                }
            )
            .addNetworkInterceptor { chain ->
                chain.proceed(
                    chain.request()
                        .newBuilder()
                        .header("User-Agent", config.USER_AGENT)
                        .build()
                )
            }
            .connectTimeout(Duration.ofSeconds(60))
            .readTimeout(Duration.ofSeconds(60))
            .build()

        return Retrofit.Builder()
            .baseUrl(config.TOR_HOST)
            .addConverterFactory(ScalarsConverterFactory.create())
            .client(okHttpClient)
            .build()
            .create(TorApi::class.java)
    }

    @Singleton
    @Provides
    @Named("cacheDir")
    fun provideCacheDir(@ApplicationContext context: Context) = context.cacheDir
}
