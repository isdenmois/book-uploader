package com.isdenmois.bookuploader

import android.app.Application
import com.isdenmois.ebookparser.EBookParser
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class BookUploaderApp : Application() {
    override fun onCreate() {
        super.onCreate()

        EBookParser.cacheDirectory = cacheDir
    }
}
