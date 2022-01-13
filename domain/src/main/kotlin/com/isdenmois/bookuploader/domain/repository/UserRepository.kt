package com.isdenmois.bookuploader.domain.repository

import com.isdenmois.bookuploader.domain.model.User

interface UserRepository {
    /**
     * Loads user profile data
     */
    suspend fun loadProfile(): User

    /**
     * Login user by email and password
     */
    suspend fun login(email: String, password: String): String
}
