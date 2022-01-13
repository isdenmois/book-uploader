package com.isdenmois.bookuploader.core

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AppConfig @Inject constructor(@ApplicationContext context: Context) {
    val ZLIB_HOST = context.getString(R.string.ZLIB_HOST)
    val FLIBUSTA_HOST = context.getString(R.string.FLIBUSTA_HOST)
    val TOR_HOST = context.getString(R.string.TOR_HOST)
    val USER_AGENT = context.getString(R.string.USER_AGENT)
    val INITIAL_EMAIL = context.getString(R.string.INITIAL_EMAIL)
    val INITIAL_PASSWORD = context.getString(R.string.INITIAL_PASSWORD)
}
