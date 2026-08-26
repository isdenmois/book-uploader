package com.isdenmois.bookuploader.zlibrary.model

/**
 * Response of the `rpc.php` login call. Mirrors the Python login flow:
 * `resp['response']` with an optional `validationError` on failure.
 */
data class LoginResponse(
    val response: LoginResponseBody? = null,
)

data class LoginResponseBody(
    val validationError: String? = null,
    val isWrongEmail: Boolean? = null,
    val isWrongPassword: Boolean? = null,
    val isSingleLogin: Boolean? = null,
)
