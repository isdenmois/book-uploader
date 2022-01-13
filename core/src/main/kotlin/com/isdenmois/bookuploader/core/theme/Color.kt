package com.isdenmois.bookuploader.core.theme

import androidx.compose.material.Colors
import androidx.compose.material.MaterialTheme
import androidx.compose.ui.graphics.Color

val DarkColorPalette = AppColors(
    isLight = false,

    background = Color(0xff1f1d2b),
    searchBackground = Color(0xff525298),
    uploadBackground = Color(0xff805da7),
    profileBackground = Color(0xffd95333),

    tabsBackground = Color(0xff212230),
    secondaryBackground = Color(0xffE0E0E0),
    progressBackground = Color(0xffDEE2ED),
    modalBackground = Color(0xff212230),

    searchText = Color(0xfffefefe),
    uploadText = Color(0xfffefefe),
    profileText = Color(0xfffefefe),
    tabText = Color(0xff7b7c89),

    searchSelected = Color(0xff525298),
    uploadSelected = Color(0xff9c4ec2),
    profileSelected = Color(0xffff7128),

    primary = Color(0xff9c4ec2),
    invertedText = Color.White,
    secondary = Color(0xff92949b),
    search = Color(0xff8C93A3),
    input = Color(0xff252836),
    deleteButton = Color(0xff9BA8CA),
    success = Color(0xff22b07d),
    error = Color(0xffd8125d),
)

val LightColorPalette = AppColors(
    isLight = true,

    background = Color(0xffF9FAFE),
    searchBackground = Color(0xffB8D5F9),
    uploadBackground = Color(0xffC2B9F9),
    profileBackground = Color(0xffFFAD99),
    tabsBackground = Color.White,
    secondaryBackground = Color(0xffE0E0E0),
    progressBackground = Color(0xffDEE2ED),
    modalBackground = Color.White,

    searchText = Color(0xff092D5D),
    uploadText = Color(0xff15085E),
    profileText = Color(0xff661400),
    tabText = Color(0xff121417),

    searchSelected = Color(0xff5396EE),
    uploadSelected = Color(0xff6851F0),
    profileSelected = Color(0xffFF6842),

    primary = Color(0xff15085E),
    invertedText = Color.White,
    secondary = Color(0xff787D87),
    search = Color(0xff8C93A3),
    input = Color.White,
    deleteButton = Color(0xff9BA8CA),
    success = Color(0xff48B755),
    error = Color(0xffFD4463),
)

/**
 * A Material [Colors] implementation which sets all colors to [debugColor] to discourage usage of
 * [MaterialTheme.colors] in preference to [AppTheme.colors].
 */
fun debugColors(
    darkTheme: Boolean,
    debugColor: Color = Color.Magenta
) = Colors(
    primary = debugColor,
    primaryVariant = debugColor,
    secondary = debugColor,
    secondaryVariant = debugColor,
    background = debugColor,
    surface = debugColor,
    error = debugColor,
    onPrimary = debugColor,
    onSecondary = debugColor,
    onBackground = debugColor,
    onSurface = debugColor,
    onError = debugColor,
    isLight = !darkTheme
)
