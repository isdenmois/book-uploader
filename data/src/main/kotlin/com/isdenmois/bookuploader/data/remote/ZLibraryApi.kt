package com.isdenmois.bookuploader.data.remote

import retrofit2.Response
import retrofit2.http.FieldMap
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.QueryMap

interface ZLibraryApi {
    @FormUrlEncoded
    @POST("rpc.php")
    suspend fun login(@FieldMap data: Map<String, String>): Response<String>

    @GET("/papi/user/dstats")
    suspend fun getProfile(
        @Header("Cookie") cookie: String? = null,
    ): String

    @FormUrlEncoded
    @POST("/eapi/book/search")
    suspend fun search(
        @FieldMap data: Map<String, String>,
        @Header("Cookie") cookie: String? = null,
    ): Response<String>

    @GET("{path}")
    suspend fun textRequest(
        @Path("path", encoded = true) path: String,
        @QueryMap query: Map<String, String> = mapOf(),
        @Header("cookie") cookie: String? = null,
    ): String
}
