plugins {
    id(Plugins.androidApplication)
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
        applicationId = "com.isdenmois.bookuploader"
        minSdk = Versions.minSdk
        targetSdk = Versions.sdk
        versionCode = 3100
        versionName = "3.1.0"

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
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = Versions.compose
    }
    packagingOptions {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(AndroidX.core.ktx)
    implementation(AndroidX.compose.ui)
    implementation(AndroidX.compose.material)
    implementation(AndroidX.compose.ui.toolingPreview)
    implementation(AndroidX.activity.compose)

    testImplementation(Testing.junit4)
    androidTestImplementation(AndroidX.test.ext.junit)
    androidTestImplementation(AndroidX.test.espresso.core)
    androidTestImplementation(AndroidX.compose.ui.testJunit4)
    debugImplementation(AndroidX.compose.ui.tooling)

    implementation(Libs.EBookParser)

    // Coroutines
    implementation(KotlinX.coroutines.core)
    implementation(KotlinX.coroutines.android)

    // Hilt
    implementation(Google.dagger.hilt.android)
    kapt(Google.dagger.hilt.compiler)
    implementation(AndroidX.lifecycle.viewModelCompose)
    implementation(JavaX.AnnotationApi)

    // Accompanist
    implementation(Google.accompanist.pager)

    // Project dependencies
    implementation(project(ModuleDependency.core))
    implementation(project(ModuleDependency.domain))
    implementation(project(ModuleDependency.data))
    implementation(project(ModuleDependency.Feature.bookImport))
    implementation(project(ModuleDependency.Feature.profile))
    implementation(project(ModuleDependency.Feature.search))
    implementation(project(ModuleDependency.Feature.upload))
}
