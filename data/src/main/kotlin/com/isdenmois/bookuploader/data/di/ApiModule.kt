package com.isdenmois.bookuploader.data.di

import android.content.Context
import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.data.remote.FlibustaApi
import com.isdenmois.bookuploader.data.remote.TorApi
import com.isdenmois.bookuploader.data.remote.UploadApi
import com.isdenmois.bookuploader.data.remote.UploadHostInterceptor
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
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
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.converter.scalars.ScalarsConverterFactory

@Module
@InstallIn(SingletonComponent::class)
object ApiModule {
    @Singleton
    @Provides
    fun provideMoshi(): Moshi =
        Moshi.Builder().addLast(KotlinJsonAdapterFactory()).build()

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
    fun provideHttpClient(config: AppConfig): OkHttpClient = OkHttpClient.Builder()
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

    @Singleton
    @Provides
    fun provideTorApi(config: AppConfig, okHttpClient: OkHttpClient): TorApi = Retrofit.Builder()
        .baseUrl(config.TOR_HOST)
        .addConverterFactory(ScalarsConverterFactory.create())
        .client(okHttpClient)
        .build()
        .create(TorApi::class.java)

    @Singleton
    @Provides
    fun provideFlibustaApi(config: AppConfig, okHttpClient: OkHttpClient, moshi: Moshi): FlibustaApi = Retrofit.Builder()
        .baseUrl(config.FLIBUSTA_HOST)
        .addConverterFactory(ScalarsConverterFactory.create())
        .addConverterFactory(MoshiConverterFactory.create(moshi))
        .client(okHttpClient)
        .build()
        .create(FlibustaApi::class.java)

    @Singleton
    @Provides
    @Named("cacheDir")
    fun provideCacheDir(@ApplicationContext context: Context) = context.cacheDir
}
