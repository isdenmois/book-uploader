package com.isdenmois.bookuploader.data.di

import com.isdenmois.bookuploader.data.BookSearchRepositoryImpl
import com.isdenmois.bookuploader.data.QrRepositoryImpl
import com.isdenmois.bookuploader.data.ShareRepositoryImpl
import com.isdenmois.bookuploader.data.UploadRepositoryImpl
import com.isdenmois.bookuploader.data.UserRepositoryImpl
import com.isdenmois.bookuploader.domain.repository.BookSearchRepository
import com.isdenmois.bookuploader.domain.repository.QrRepository
import com.isdenmois.bookuploader.domain.repository.ShareRepository
import com.isdenmois.bookuploader.domain.repository.UploadRepository
import com.isdenmois.bookuploader.domain.repository.UserRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class DataModule {
    @Singleton
    @Binds
    abstract fun bindUploadRepository(uploadRepository: UploadRepositoryImpl): UploadRepository

    @Singleton
    @Binds
    abstract fun bindShareRepository(shareRepository: ShareRepositoryImpl): ShareRepository

    @Singleton
    @Binds
    abstract fun bindQrRepository(qrRepository: QrRepositoryImpl): QrRepository

    @Singleton
    @Binds
    abstract fun bindBookSearchRepository(bookSearchRepository: BookSearchRepositoryImpl): BookSearchRepository

    @Singleton
    @Binds
    abstract fun bindUserRepository(userRepository: UserRepositoryImpl): UserRepository
}
