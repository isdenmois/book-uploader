package com.bookuploader;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;

import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONException;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class FileOpener extends ReactContextBaseJavaModule {

  public FileOpener(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "FileOpener";
  }

  @Override
  public Map<String, Object> getConstants() {
    return new HashMap<>();
  }

  @ReactMethod
  public void open(String fileArg, String contentType, Promise promise) throws JSONException {
    File file = new File(fileArg);

    if (file.exists()) {
      try {
        Uri uriForFile = FileProvider.getUriForFile(getCurrentActivity(), this.getReactApplicationContext().getPackageName() + ".provider", file);
        Intent intent = new Intent(Intent.ACTION_VIEW).setDataAndType(uriForFile, contentType);
        PackageManager pm = getCurrentActivity().getPackageManager();

        intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);

        if (intent.resolveActivity(pm) != null) {
          this.getReactApplicationContext().startActivity(intent);
        }

        promise.resolve("Open success!!");
      } catch (android.content.ActivityNotFoundException e) {
        promise.reject("Open error!!");
      }
    } else {
      promise.reject("File not found");
    }
  }

}
