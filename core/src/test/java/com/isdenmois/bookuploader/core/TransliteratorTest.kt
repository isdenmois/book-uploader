package com.isdenmois.bookuploader.core

import org.junit.Assert.*
import org.junit.Test

class TransliteratorTest {
    @Test
    fun transliterate() {
        assertEquals("olga", Transliterator.transliterate("ОльГа"))
        assertEquals("garri-goncharischnev", Transliterator.transliterate("Гарри Гончарищнев"))
        assertEquals("artur_pirozhok", Transliterator.transliterate("Артур_Пирожок"))
        assertEquals("ororo7", Transliterator.transliterate("ороро7?"))
    }

    @Test
    fun shouldTransliterateUppercase() {
        assertEquals("ah-ti-elku-priqupiule", Transliterator.transliterate("Ах ты ёлку priqupiule"))
    }

    @Test
    fun shouldWorkWithNumbers() {
        assertEquals("1234567890-", Transliterator.transliterate("1234567890-="))
    }

    @Test
    fun shouldWorkWithEnglish() {
        assertEquals("qwertyuiop", Transliterator.transliterate("qwertyuiop[]{}|\\"))
        assertEquals("asdfghjkl", Transliterator.transliterate("asdfghjkl;':\""))
        assertEquals("zxcvbnm", Transliterator.transliterate("zxcvbnm,./<>?"))
    }

    @Test
    fun shouldWorkWithCyrillic() {
        assertEquals("ytsukengshschzh", Transliterator.transliterate("йцукенгшщзхъ"))
        assertEquals("fivaproldzhe", Transliterator.transliterate("фывапролджэ"))
        assertEquals("yachsmitbyu", Transliterator.transliterate("ячсмитьбю."))
    }
}
