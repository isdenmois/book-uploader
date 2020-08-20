package com.bookuploader.parser;

import java.io.File;
import java.io.IOException;

abstract class BookParser {
    protected String path;
    protected String author;
    protected String title;
    protected String format;

    protected void renameFile() {
        if (emt(author) && emt(title)) return;
        String destName = !emt(author) ? author + "_" + title : title;
        destName = destName.replaceAll(" ", "-").toLowerCase();

        File from = new File(this.path);
        File to = new File(from.getParent(), this.transliterate(destName) + format);

        if (from.getName().equals(to.getName())) return;

        if (from.renameTo(to)) {
            path = to.getAbsolutePath();
        }
    }
    abstract EbookMetadata parse() throws IOException;

    boolean emt(String s) {
        return s == null || s.trim().length() == 0;
    }

    private String transliterate(String message){
        char[] abcCyr =   {'-','_',' ','а','б','в','г','д','е','ё', 'ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х', 'ц','ч', 'ш','щ','ъ','ы','ь','э', 'ю','я','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};
        String[] abcLat = {"-","_"," ","a","b","v","g","d","e","e","zh","z","i","y","k","l","m","n","o","p","r","s","t","u","f","h","ts","ch","sh","sch", "","i", "","e","ju","ja","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"};
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < message.length(); i++) {
            for (int x = 0; x < abcCyr.length; x++ ) {
                if (message.charAt(i) == abcCyr[x]) {
                    builder.append(abcLat[x]);
                }
            }
        }
        return builder.toString();
    }
}
