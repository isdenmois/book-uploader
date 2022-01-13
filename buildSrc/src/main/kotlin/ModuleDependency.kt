object ModuleDependency {
    const val app = ":app"
    const val core = ":core"
    const val data = ":data"
    const val domain = ":domain"

    object Feature {
        private const val directory = ":features"

        const val bookImport = "$directory:bookimport"
        const val upload = "$directory:upload"
        const val search = "$directory:search"
        const val profile = "$directory:profile"
    }
}
