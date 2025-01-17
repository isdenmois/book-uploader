plugins {
    alias(libs.plugins.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.ksp)
    alias(libs.plugins.hilt)
}

android {
    namespace = "com.isdenmois.bookuploader"

    compileSdk = Versions.sdk

    defaultConfig {
        applicationId = "com.isdenmois.bookuploader"
        minSdk = Versions.minSdk
        targetSdk = Versions.sdk
        versionCode = 3200
        versionName = "3.2.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        named("release") {
            isMinifyEnabled = true
            isShrinkResources = true
            setProguardFiles(listOf(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"))
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
    kotlinOptions {
        jvmTarget = "21"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = libs.versions.composeCompiler.get()
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.core.ktx)
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.material)
    implementation(libs.compose.material.icons)
    implementation(libs.compose.ui.tooling.preview)
    implementation(libs.activity.compose)

    debugImplementation(libs.compose.ui.tooling)

    implementation(libs.ebookparser)

    // Coroutines
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)

    // Hilt
    implementation(libs.hilt.android)
    ksp(libs.hilt.android.compiler)
    implementation(libs.lifecycle.viewmodel.compose)
//    implementation(JavaX.AnnotationApi)

    // Accompanist
    // Deprecated because Pager is now directly into androidx.compose.foundation.
    //FIXME: Migrate using the following guide:
    // https://google.github.io/accompanist/pager/
    implementation(libs.accompanist.pager)

    // Project dependencies
    implementation(project(ModuleDependency.core))
    implementation(project(ModuleDependency.domain))
    implementation(project(ModuleDependency.data))
    implementation(project(ModuleDependency.Feature.bookImport))
    implementation(project(ModuleDependency.Feature.profile))
    implementation(project(ModuleDependency.Feature.search))
    implementation(project(ModuleDependency.Feature.upload))

    // Testing
    testImplementation(libs.junit)
    androidTestImplementation(libs.junit.ext)
    androidTestImplementation(libs.espresso)
}
