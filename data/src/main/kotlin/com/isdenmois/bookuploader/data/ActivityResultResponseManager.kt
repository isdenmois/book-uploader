package com.isdenmois.bookuploader.data

import android.content.Intent
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

interface ActivityRunner {
    fun runActivity(intent: Intent, id: Int)
}

@Singleton
class ActivityResultManager @Inject constructor() {
    private val callbacks = WeakHashMap<Int, (Int, Intent?) -> Unit>()
    private var runner: ActivityRunner? = null

    fun startActivityForResult(intent: Intent, requestCode: Int, callback: (Int, Intent?) -> Unit) {
        callbacks[requestCode] = callback
        runner?.runActivity(intent, requestCode)
    }

    fun onResult(requestCode: Int, resultCode: Int, data: Intent?) {
        try {
            callbacks[requestCode]?.invoke(resultCode, data)
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            callbacks.remove(requestCode)
        }
    }

    fun setRunner(runner: ActivityRunner) {
        this.runner = runner
    }
}
