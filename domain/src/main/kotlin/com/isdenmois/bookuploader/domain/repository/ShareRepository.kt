package com.isdenmois.bookuploader.domain.repository

import java.io.File

interface ShareRepository {
    /**
     * Shares file
     */
    fun shareEbook(file: File)
}
