pluginManagement {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}

dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven(url = "https://jitpack.io")
    }
}

rootProject.name = "Book Uploader"

// Main module
include(":app")

// Core modules
include(":core")
include(":data")
include(":domain")

// Features
include(
    ":features:bookimport",
    ":features:profile",
    ":features:search",
    ":features:upload",
)
