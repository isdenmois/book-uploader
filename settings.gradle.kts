pluginManagement {
    plugins {
        id("de.fayard.refreshVersions") version "0.30.2"
    }
}

plugins {
    id("de.fayard.refreshVersions")
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
