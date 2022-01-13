package com.isdenmois.bookuploader.domain.usecase.profile

import com.isdenmois.bookuploader.domain.model.User
import com.isdenmois.bookuploader.domain.repository.UserRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class LoadUserProfileUseCase @Inject constructor(
    private val repository: UserRepository,
) {
    suspend operator fun invoke(): User = repository.loadProfile()
}
