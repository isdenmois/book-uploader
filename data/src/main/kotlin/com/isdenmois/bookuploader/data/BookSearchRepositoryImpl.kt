package com.isdenmois.bookuploader.data

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.ContentResolver
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.provider.MediaStore
import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.core.Extension
import com.isdenmois.bookuploader.core.Transliterator
import com.isdenmois.bookuploader.data.parsers.FlibustaParser
import com.isdenmois.bookuploader.data.parsers.ZLibraryParser
import com.isdenmois.bookuploader.data.remote.TorApi
import com.isdenmois.bookuploader.data.remote.downloadToFileWithProgress
import com.isdenmois.bookuploader.data.remote.downloadToStreamWithProgress
import com.isdenmois.bookuploader.domain.model.Book
import com.isdenmois.bookuploader.domain.repository.BookSearchRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.onCompletion
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.ResponseBody
import java.io.File
import javax.inject.Inject
import javax.inject.Named


class BookSearchRepositoryImpl @Inject constructor(
    @Named("cacheDir") private val cacheDir: File,
    @ApplicationContext private val context: Context,
    private val contentResolver: ContentResolver,
    private val config: AppConfig,
    private val torApi: TorApi,
    private val flibustaParser: FlibustaParser,
    private val zLibraryParser: ZLibraryParser,
    private val preferences: AppPreferences,
    private val httpClient: OkHttpClient,
    private val notificationManager: NotificationManager,
) : BookSearchRepository {
    override suspend fun searchBooksInFlibusta(query: String): List<Book> = withContext(Dispatchers.Default) {
        val body = torApi.textRequest(
            host = config.FLIBUSTA_HOST,
            path = flibustaParser.path,
            query = flibustaParser.query + mapOf("searchTerm" to query, "noproxy" to "true"),
        )

        return@withContext flibustaParser.parse(body)
    }

    override suspend fun searchBooksInFlibustaTor(query: String): List<Book> = withContext(Dispatchers.Default) {
        val body = torApi.textRequest(
            host = config.FLIBUSTA_TOR_HOST,
            path = flibustaParser.path,
            query = flibustaParser.query + mapOf("searchTerm" to query),
        )

        return@withContext flibustaParser.parse(body)
    }

    override suspend fun downloadFlibustaBook(book: Book): Flow<Float> {
        val body = torApi.downloadFile(
            host = config.FLIBUSTA_HOST,
            query = mapOf("noproxy" to "true"),
            path = book.link,
        )

        return downloadFile(book, body)
    }

    override suspend fun downloadFlibustaTorBook(book: Book): Flow<Float> {
        val body = torApi.downloadFile(
            host = config.FLIBUSTA_TOR_HOST,
            path = book.link,
        )

        return downloadFile(book, body)
    }

    override suspend fun searchBooksInZLibrary(query: String, extension: Extension?): List<Book> =
        withContext(Dispatchers.Default) {
            val queryMap = if (extension == null) mapOf() else mapOf("extensions" to extension.value)
            val response = torApi.postForm(
                host = config.ZLIB_HOST,
                path = "/eapi/book/search",
                body = queryMap + mapOf(
                    "message" to query,
                    "limit" to "50",
                    "order" to "popular",
                ),
                cookie = preferences.zlibAuth.value,
            )

            return@withContext zLibraryParser.parseBody(response.body() ?: "{\"success\": 0}", extension?.value)
        }

    override suspend fun downloadZLibraryBook(book: Book): Flow<Float> {
        val url = zLibraryParser.getFilePath(book.link)

        val request = Request.Builder().url(url).build();
        val response = httpClient.newCall(request).execute()
        val body = response.body ?: return flowOf(100.0f)

        return downloadFile(book, body)
    }

    private fun downloadFile(book: Book, body: ResponseBody): Flow<Float> {
        if (preferences.useDirectDownloads.value) {
            return downloadWithNotification(book, body)
        }

        return body.downloadToFileWithProgress(cacheDir, book.getFileName())
    }

    private fun downloadWithNotification(book: Book, body: ResponseBody): Flow<Float> {
        val notificationId = 1
        val channelId = createDownloadsChannel()

        val uri = createBookDownloadUri(book) ?: return flowOf(100f)
        val outputStream = contentResolver.openOutputStream(uri) ?: return flowOf(100f)

        return body.downloadToStreamWithProgress(outputStream).onCompletion {
            val notification = buildBookDownloadNotification(book, uri, channelId)
            notificationManager.notify(notificationId, notification)
        }
    }

    private fun createBookDownloadUri(book: Book): Uri? {
        val contentValues = ContentValues().apply {
            put(MediaStore.Downloads.DISPLAY_NAME, book.getFileName())
            put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
        }

        return contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
    }

    private fun createDownloadsChannel(): String {
        val channelId = "downloads"

        val name = "Downloads Channel"
        val descriptionText = "Channel for downloads"
        val importance = NotificationManager.IMPORTANCE_DEFAULT
        val channel = NotificationChannel(channelId, name, importance).apply {
            description = descriptionText
        }
        // Register the channel with the system
        notificationManager.createNotificationChannel(channel)

        return channelId
    }

    private fun buildBookDownloadNotification(book: Book, uri: Uri, channelId: String): Notification {
        val intent = Intent(Intent.ACTION_VIEW)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        intent.setDataAndType(uri, "application/epub+zip")

        val pendingIntent: PendingIntent =
            PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)

        return Notification.Builder(context, channelId)
            .setSmallIcon(R.drawable.ic_file)
            .setContentTitle(book.title)
            .setAutoCancel(true)
            .setContentText("Book successfully downloaded")
            .setContentIntent(pendingIntent)
            .build()
    }
}

fun Book.getFileName() = Transliterator.transliterate("${authors}_$title.$ext")
