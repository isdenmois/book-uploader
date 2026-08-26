package com.isdenmois.bookuploader.zlibrary.api

import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.FieldMap
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query
import retrofit2.http.Streaming
import retrofit2.http.Url

/**
 * HTTP layer for z-library, mirroring the Python `util.py` requests.
 *
 * Search paths take the query URL-encoded as a path segment (the Python
 * client uses `quote(q)`); `@Query("languages[]")` names are emitted
 * verbatim by OkHttp (brackets are not in the query component encode set),
 * which is what the server expects.
 */
interface ZlibApi {
    @FormUrlEncoded
    @POST("rpc.php")
    suspend fun login(@FieldMap data: Map<String, String>): Response<String>

    @GET("s/{query}")
    suspend fun search(
        @Path("query") query: String,
        @Query("e") exact: Int? = null,
        @Query("yearFrom") fromYear: Int? = null,
        @Query("yearTo") toYear: Int? = null,
        @Query("languages[]") languages: List<String>? = null,
        @Query("extensions[]") extensions: List<String>? = null,
        @Query("page") page: Int,
        @Header("cookie") cookie: String? = null,
    ): String

    @GET("fulltext/{query}")
    suspend fun fullTextSearch(
        @Path("query") query: String,
        @Query("type") type: String,
        @Query("e") exact: Int? = null,
        @Query("yearFrom") fromYear: Int? = null,
        @Query("yearTo") toYear: Int? = null,
        @Query("languages[]") languages: List<String>? = null,
        @Query("extensions[]") extensions: List<String>? = null,
        @Query("page") page: Int,
        @Header("cookie") cookie: String? = null,
    ): String

    /**
     * Fetches a book detail page. `id` looks like `123/slug`; the slash must
     * survive, hence `encoded = true`.
     */
    @GET("book/{id}")
    suspend fun book(
        @Path(value = "id", encoded = true) id: String,
        @Header("cookie") cookie: String? = null,
    ): String

    /** Generic page fetch for arbitrary (absolute) URLs. */
    @GET
    suspend fun getPage(
        @Url url: String,
        @Header("cookie") cookie: String? = null,
    ): String

    @GET("papi/booklist/{id}/get-books/{page}")
    suspend fun booklistBooks(
        @Path("id") id: String,
        @Path("page") page: Int,
        @Header("cookie") cookie: String? = null,
    ): String

    @GET("users/downloads")
    suspend fun downloadLimits(@Header("cookie") cookie: String? = null): String

    @GET("users/dstats.php")
    suspend fun downloadHistory(
        @Query("date_from") dateFrom: String? = null,
        @Query("date_to") dateTo: String? = null,
        @Query("page") page: Int,
        @Header("cookie") cookie: String? = null,
    ): String

    @Streaming
    @GET
    suspend fun downloadFile(
        @Url url: String,
        @Header("cookie") cookie: String? = null,
    ): ResponseBody
}
