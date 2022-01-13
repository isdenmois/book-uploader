package com.isdenmois.bookuploader.domain.usecase.profile

import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.domain.repository.UserRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class LoginUseCase @Inject constructor(
    private val repository: UserRepository,
    private val preferences: AppPreferences,
) {
    suspend operator fun invoke(email: String, password: String) {
        val token = repository.login(email, password)

        preferences.setZlibAuth(token)
    }
}
