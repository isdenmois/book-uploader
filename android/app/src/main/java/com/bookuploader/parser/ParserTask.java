package com.bookuploader.parser;

import android.os.AsyncTask;

import com.facebook.react.bridge.Promise;

public class ParserTask extends AsyncTask<Void, Void, EbookMetadata> {
    String path;
    Promise promise;
    Exception e;

    public ParserTask(String path, Promise promise) {
        this.path = path;
        this.promise = promise;
    }

    @Override
    protected EbookMetadata doInBackground(Void... voids) {
        BookParser parser = path.endsWith(".epub") ? new EPUBParser(path) : new FB2Parser(path);

        try {
            return parser.parse();
        } catch (Exception e) {
            promise.reject(e);
        }

        return null;
    }

    @Override
    protected void onPostExecute(EbookMetadata data) {
        if (e != null) {
            promise.reject(e);
        } if (data == null) {
            promise.reject(new Exception("Sraka kakayato"));
        } else {
            promise.resolve(data.getMap());
        }
    }
}
