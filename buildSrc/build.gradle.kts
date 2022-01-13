plugins {
    `kotlin-dsl`
}

repositories {
    google()
    mavenCentral()
}

@Suppress("GradlePluginVersion")
dependencies {
    implementation("com.android.tools.build:gradle:_")
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:_")
    implementation(Google.dagger.hilt.android.gradlePlugin)
}
