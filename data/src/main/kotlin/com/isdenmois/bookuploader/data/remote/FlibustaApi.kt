package com.isdenmois.bookuploader.data.remote

import com.isdenmois.bookuploader.data.model.FBook
import okhttp3.ResponseBody
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query
import retrofit2.http.Streaming

interface FlibustaApi {
    @GET("/api/search")
    suspend fun searchBooks(
        @Query("q") q: String,
    ): List<FBook>

    @Streaming
    @GET("/dl/{id}")
    suspend fun downloadBook(
        @Path("id") id: String,
    ): ResponseBody
}
