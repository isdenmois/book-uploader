import de.fayard.refreshVersions.core.versionFor

object Versions {
    const val sdk = 31
    const val minSdk = 30

    val compose = versionFor(AndroidX.compose.ui)
    val ktlint = versionFor("plugin.org.jlleitschuh.gradle.ktlint-gradle")
    val dotEnv = versionFor("plugin.co.uzzu.dotenv.gradle")
}
