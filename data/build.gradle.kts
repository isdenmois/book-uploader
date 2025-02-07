plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.ksp)
    alias(libs.plugins.hilt)
}

android {
    namespace = "com.isdenmois.bookuploader.data"

    compileSdk = Versions.sdk

    defaultConfig {
        minSdk = Versions.minSdk
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
    implementation(libs.compose.ui.tooling.preview)
    implementation(libs.activity.compose)

    implementation(libs.ebookparser)
    implementation(libs.jsoup)

    // Coroutines
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)

    // Hilt
    implementation(libs.hilt.android)
    ksp(libs.hilt.android.compiler)
//    implementation(JavaX.AnnotationApi)

    // Retrofit
    implementation(libs.retrofit)
    implementation(libs.retrofit.moshi)
    implementation(libs.retrofit.scalars)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)

    // Moshi
    ksp(libs.moshi.codegen)
    implementation(libs.moshi)
    implementation(libs.moshi.kotlin)

    // Other
    implementation(libs.code.scanner)

    // Test
    testImplementation(libs.junit)
//    testImplementation(Testing.mockK)
//    testImplementation(Testing.mockK.common)
//    testImplementation(KotlinX.coroutines.test)
    androidTestImplementation(libs.junit.ext)
    androidTestImplementation(libs.espresso)
//    androidTestImplementation(AndroidX.compose.ui.testJunit4)
//    debugImplementation(AndroidX.compose.ui.tooling)

    // Project dependencies
    implementation(project(ModuleDependency.core))
    implementation(project(ModuleDependency.domain))
}
