package com.isdenmois.bookuploader.data.remote

import okhttp3.ResponseBody
import retrofit2.http.FieldMap
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.Response
import retrofit2.http.POST
import retrofit2.http.Query
import retrofit2.http.QueryMap
import retrofit2.http.Streaming

interface TorApi {
    @GET("/api/rewrite")
    suspend fun textRequest(
        @Query("host") host: String,
        @Query("path") path: String,
        @QueryMap query: Map<String, String> = mapOf(),
        @Header("cookie") cookie: String? = null,
    ): String

    @Streaming
    @GET("/api/rewrite")
    suspend fun downloadFile(
        @Query("host") host: String,
        @Query("path") path: String,
        @QueryMap query: Map<String, String> = mapOf(),
        @Header("cookie") cookie: String? = null,
    ): ResponseBody

    @FormUrlEncoded
    @POST("/api/rewrite")
    suspend fun postForm(
        @Query("host") host: String,
        @Query("path") path: String,
        @FieldMap body: Map<String, String>,
    ): Response<String>
}
