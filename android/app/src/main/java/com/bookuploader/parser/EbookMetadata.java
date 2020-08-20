package com.bookuploader.parser;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.io.File;

public class EbookMetadata {
    public String title;
    public String author;
    public FileData file;

    EbookMetadata(String path, String title, String author) {
        this.title = title;
        this.author = author;
        this.file = new FileData(path);
    }

    WritableMap getMap() {
        WritableMap map = Arguments.createMap();

        map.putString("author", author);
        map.putString("title", title);
        map.putMap("file", file.getMap());

        return map;
    }
}

class FileData {
    public String filename;
    public String filepath;

    FileData(String path) {
        File f = new File(path);
        this.filepath = path;
        this.filename = f.getName();
    }


    WritableMap getMap() {
        WritableMap map = Arguments.createMap();

        map.putString("filename", filename);
        map.putString("filepath", filepath);
        map.putString("filetype", "application/octet-stream");

        return map;
    }
}
