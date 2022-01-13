package com.isdenmois.bookuploader.core

object Transliterator {
    fun transliterate(message: String): String {
        val builder = StringBuilder()

        for (element in message.lowercase()) {
            if (element in abcMap) {
                builder.append(abcMap[element])
            }
        }
        return builder.toString()
    }

    private val abcMap = mapOf(
        '_' to '_',
        '-' to '-',
        ' ' to '-',
        '.' to '.',
        'а' to 'a',
        'б' to 'b',
        'в' to 'v',
        'г' to 'g',
        'д' to 'd',
        'е' to 'e',
        'ё' to 'e',
        'ж' to "zh",
        'з' to 'z',
        'и' to 'i',
        'й' to 'y',
        'к' to 'k',
        'л' to 'l',
        'м' to 'm',
        'н' to 'n',
        'о' to 'o',
        'п' to 'p',
        'р' to 'r',
        'с' to 's',
        'т' to 't',
        'у' to 'u',
        'ф' to 'f',
        'х' to 'h',
        'ц' to "ts",
        'ч' to "ch",
        'ш' to "sh",
        'щ' to "sch",
        'ы' to "i",
        'э' to "e",
        'ю' to "yu",
        'я' to "ya",
        'a' to 'a',
        'b' to 'b',
        'c' to 'c',
        'd' to 'd',
        'e' to 'e',
        'f' to 'f',
        'g' to 'g',
        'h' to 'h',
        'i' to 'i',
        'j' to 'j',
        'k' to 'k',
        'l' to 'l',
        'm' to 'm',
        'n' to 'n',
        'o' to 'o',
        'p' to 'p',
        'q' to 'q',
        'r' to 'r',
        's' to 's',
        't' to 't',
        'u' to 'u',
        'v' to 'v',
        'w' to 'w',
        'x' to 'x',
        'y' to 'y',
        'z' to 'z',
        '0' to '0',
        '1' to '1',
        '2' to '2',
        '3' to '3',
        '4' to '4',
        '5' to '5',
        '6' to '6',
        '7' to '7',
        '8' to '8',
        '9' to '9',
    )
}
