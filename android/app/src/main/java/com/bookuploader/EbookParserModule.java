package com.bookuploader;

import com.bookuploader.parser.ParserTask;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class EbookParserModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    EbookParserModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "EbookParser";
    }

    @ReactMethod
    public void getMetadata(String path, Promise promise) {
        new ParserTask(path, promise).execute();
    }
}
