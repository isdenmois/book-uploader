package com.isdenmois.bookuploader.profile

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.isdenmois.bookuploader.core.AppConfig
import com.isdenmois.bookuploader.core.AppPreferences
import com.isdenmois.bookuploader.domain.model.User
import com.isdenmois.bookuploader.domain.usecase.profile.LoadUserProfileUseCase
import com.isdenmois.bookuploader.domain.usecase.profile.LoginUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.launch

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val preferences: AppPreferences,
    private val loadUserProfile: LoadUserProfileUseCase,
    private val loginUseCase: LoginUseCase,
    config: AppConfig,
) : ViewModel() {
    val zlibAuth = preferences.zlibAuth

    val email = mutableStateOf(config.INITIAL_EMAIL)
    val password = mutableStateOf(config.INITIAL_PASSWORD)

    val user = mutableStateOf<User?>(null)
    val isLoading = mutableStateOf(zlibAuth.value?.isNotBlank() == true)
    val error = mutableStateOf<String?>(null)

    fun loadProfileInfo() {
        if (zlibAuth.value?.isNotBlank() == true) {
            isLoading.value = true
            user.value = null

            viewModelScope.launch {
                try {
                    user.value = loadUserProfile()
                } catch (e: Exception) {
                    e.printStackTrace()
                }

                isLoading.value = false
            }
        }
    }

    fun login() {
        if (email.value.isNotBlank() && password.value.isNotBlank()) {
            isLoading.value = true
            error.value = null

            viewModelScope.launch {
                try {
                    loginUseCase(email.value, password.value)

                    loadProfileInfo()
                } catch (e: Exception) {
                    e.printStackTrace()
                    error.value = e.message ?: "Something wen wrong"
                }
            }
        }
    }

    fun logout() {
        preferences.setZlibAuth(null)
    }
}
