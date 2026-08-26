package com.isdenmois.bookuploader.zlibrary.exception

/** Raised when login credentials are rejected by the server. */
class LoginFailedException(message: String) : Exception(message)

/** Raised when an HTML page could not be parsed. */
class ParseException(message: String) : Exception(message)

/** Raised when an action requiring an authenticated session is attempted before login. */
class NotLoggedInException(message: String) : Exception(message)

/** Raised when a search is attempted with an empty query. */
class EmptyQueryException(message: String) : Exception(message)

/** Raised when a book id/url is empty. */
class NoIdException(message: String) : Exception(message)
