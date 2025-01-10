
plugins {
//    alias(libs.plugins.ktlint) apply false
//    alias(libs.plugins.kotlin.android) apply false
//    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}

repositories {
    mavenCentral()
    gradlePluginPortal()
}

//subprojects {
//    apply {
//        plugin(Plugins.ktlint)
//    }
//
//    configureKtlint()
//}
//
//fun Project.configureKtlint() {
//    ktlint {
//        debug.set(true)
//        verbose.set(true)
//        android.set(true)
//        outputToConsole.set(true)
//        outputColorName.set("BLUE")
//        ignoreFailures.set(true)
//        enableExperimentalRules.set(true)
//
//        reporters {
//            reporter(PLAIN)
//            reporter(CHECKSTYLE)
//        }
//
//        filter {
//            exclude("**/generated/**")
//            include("**/kotlin/**")
//        }
//    }
//}
