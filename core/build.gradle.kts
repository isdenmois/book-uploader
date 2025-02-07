plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.ksp)
    alias(libs.plugins.hilt)
}

android {
    namespace = "com.isdenmois.bookuploader.core"

    compileSdk = Versions.sdk

    defaultConfig {
        minSdk = Versions.minSdk

        resValue("string", "ZLIB_HOST", env.ZLIB_HOST.value)
        resValue("string", "FLIBUSTA_HOST", env.FLIBUSTA_HOST.value)
        resValue("string", "FLIBUSTA_OLD_HOST", env.FLIBUSTA_OLD_HOST.value)
        resValue("string", "FLIBUSTA_HOST_TOR", env.FLIBUSTA_HOST_TOR.value)
        resValue("string", "TOR_HOST", env.TOR_HOST.value)
        resValue("string", "USER_AGENT", env.USER_AGENT.value)
        resValue("string", "INITIAL_EMAIL", env.INITIAL_EMAIL.value)
        resValue("string", "INITIAL_PASSWORD", env.INITIAL_PASSWORD.value)
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = libs.versions.composeCompiler.get()
    }
}

dependencies {
    implementation(libs.core.ktx)
    implementation(libs.compose.ui)
    implementation(libs.compose.material)
    implementation(libs.compose.material.icons)
    implementation(libs.compose.ui.tooling.preview)
    implementation(libs.activity.compose)

    // Coil
    implementation(libs.coil.compose)

    // Hilt
    implementation(libs.hilt.android)
    ksp(libs.hilt.android.compiler)
//    implementation(JavaX.AnnotationApi)

    testImplementation(libs.junit)
    androidTestImplementation(libs.junit.ext)
    androidTestImplementation(libs.espresso)
//    androidTestImplementation(AndroidX.compose.ui.testJunit4)
//    debugImplementation(AndroidX.compose.ui.tooling)
}
