plugins {
    id(Plugins.androidLibrary)
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

    implementation(Libs.EBookParser)
    implementation(Libs.jsoup)

    // Coroutines
    implementation(KotlinX.coroutines.core)
    implementation(KotlinX.coroutines.android)

    // Hilt
    implementation(Google.dagger.hilt.android)
    kapt(Google.dagger.hilt.compiler)
    implementation(JavaX.AnnotationApi)

    // Retrofit
    implementation(Square.retrofit2.retrofit)
    implementation(Square.retrofit2.converter.scalars)
    implementation(Square.okHttp3.okHttp)
    implementation(Square.okHttp3.loggingInterceptor)

    // Moshi
    kapt(Square.moshi.kotlinCodegen)
    implementation(Square.moshi)

    // Test
    testImplementation(Testing.junit4)
    testImplementation(Testing.mockK)
    testImplementation(Testing.mockK.common)
    testImplementation(KotlinX.coroutines.test)
    androidTestImplementation(AndroidX.test.ext.junit)
    androidTestImplementation(AndroidX.test.espresso.core)
    androidTestImplementation(AndroidX.compose.ui.testJunit4)
    debugImplementation(AndroidX.compose.ui.tooling)

    // Project dependencies
    implementation(project(ModuleDependency.core))
    implementation(project(ModuleDependency.domain))
}
