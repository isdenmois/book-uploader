package com.isdenmois.bookuploader.core.theme

import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color

@Stable
class AppColors(
    background: Color,
    searchBackground: Color,
    uploadBackground: Color,
    profileBackground: Color,
    tabsBackground: Color,
    secondaryBackground: Color,
    progressBackground: Color,
    modalBackground: Color,

    searchText: Color,
    uploadText: Color,
    profileText: Color,
    tabText: Color,

    searchSelected: Color,
    uploadSelected: Color,
    profileSelected: Color,

    primary: Color,
    invertedText: Color,
    secondary: Color,
    search: Color,
    input: Color,
    deleteButton: Color,
    success: Color,
    error: Color,
    isLight: Boolean
) {
    var background by mutableStateOf(background)
        private set
    var searchBackground by mutableStateOf(searchBackground)
        private set
    var uploadBackground by mutableStateOf(uploadBackground)
        private set
    var profileBackground by mutableStateOf(profileBackground)
        private set
    var tabsBackground by mutableStateOf(tabsBackground)
        private set
    var secondaryBackground by mutableStateOf(secondaryBackground)
        private set
    var progressBackground by mutableStateOf(progressBackground)
        private set
    var modalBackground by mutableStateOf(modalBackground)
        private set

    var searchText by mutableStateOf(searchText)
        private set
    var uploadText by mutableStateOf(uploadText)
        private set
    var profileText by mutableStateOf(profileText)
        private set
    var tabText by mutableStateOf(tabText)
        private set

    var searchSelected by mutableStateOf(searchSelected)
        private set
    var uploadSelected by mutableStateOf(uploadSelected)
        private set
    var profileSelected by mutableStateOf(profileSelected)
        private set

    var primary by mutableStateOf(primary)
        private set
    var invertedText by mutableStateOf(invertedText)
        private set
    var secondary by mutableStateOf(secondary)
        private set
    var search by mutableStateOf(search)
        private set
    var input by mutableStateOf(input)
        private set
    var deleteButton by mutableStateOf(deleteButton)
        private set
    var success by mutableStateOf(success)
        private set
    var error by mutableStateOf(error)
        private set
    var isLight by mutableStateOf(isLight)
        private set

    fun update(other: AppColors) {
        background = other.background
        searchBackground = other.searchBackground
        uploadBackground = other.uploadBackground
        profileBackground = other.profileBackground
        tabsBackground = other.tabsBackground
        secondaryBackground = other.secondaryBackground
        progressBackground = other.progressBackground
        modalBackground = other.modalBackground

        searchText = other.searchText
        uploadText = other.uploadText
        profileText = other.profileText
        tabText = other.tabText

        searchSelected = other.searchSelected
        uploadSelected = other.uploadSelected
        profileSelected = other.profileSelected

        primary = other.primary
        invertedText = other.invertedText
        secondary = other.secondary
        search = other.search
        input = other.input
        deleteButton = other.deleteButton
        success = other.success
        error = other.error
        isLight = other.isLight
    }

    fun copy(): AppColors = AppColors(
        background = background,
        searchBackground = searchBackground,
        uploadBackground = uploadBackground,
        profileBackground = profileBackground,
        tabsBackground = tabsBackground,
        secondaryBackground = secondaryBackground,
        progressBackground = progressBackground,
        modalBackground = modalBackground,

        searchText = searchText,
        uploadText = uploadText,
        profileText = profileText,
        tabText = tabText,

        searchSelected = searchSelected,
        uploadSelected = uploadSelected,
        profileSelected = profileSelected,

        primary = primary,
        invertedText = invertedText,
        secondary = secondary,
        search = search,
        input = input,
        deleteButton = deleteButton,
        success = success,
        error = error,
        isLight = isLight,
    )
}
