plugins {
    id(Plugins.androidLibrary)
    id(Plugins.dotEnv) version Versions.dotEnv
    kotlin("android")
    kotlin("kapt")
}

kapt {
    correctErrorTypes = true
    useBuildCache = true
}

apply { plugin(Plugins.hiltAndroid) }

android {
    compileSdk = Versions.sdk

    defaultConfig {
        minSdk = Versions.minSdk

        resValue("string", "ZLIB_HOST", env.ZLIB_HOST.value)
        resValue("string", "FLIBUSTA_HOST", env.FLIBUSTA_HOST.value)
        resValue("string", "FLIBUSTA_HOST_TOR", env.FLIBUSTA_HOST_TOR.value)
        resValue("string", "TOR_HOST", env.TOR_HOST.value)
        resValue("string", "USER_AGENT", env.USER_AGENT.value)
        resValue("string", "INITIAL_EMAIL", env.INITIAL_EMAIL.value)
        resValue("string", "INITIAL_PASSWORD", env.INITIAL_PASSWORD.value)
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = Versions.compose
    }
}

dependencies {
    implementation(AndroidX.core.ktx)
    implementation(AndroidX.compose.ui)
    implementation(AndroidX.compose.material)
    implementation(AndroidX.compose.ui.toolingPreview)
    implementation(AndroidX.activity.compose)

    // Coil
    implementation(COIL.compose)

    // Hilt
    implementation(Google.dagger.hilt.android)
    kapt(Google.dagger.hilt.compiler)
    implementation(JavaX.AnnotationApi)

    testImplementation(Testing.junit4)
    androidTestImplementation(AndroidX.test.ext.junit)
    androidTestImplementation(AndroidX.test.espresso.core)
    androidTestImplementation(AndroidX.compose.ui.testJunit4)
    debugImplementation(AndroidX.compose.ui.tooling)
}
