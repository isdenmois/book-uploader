package com.bookuploader;

import androidx.appcompat.app.AppCompatActivity;

import android.content.ContentResolver;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class ImportActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_import);

        findViewById(R.id.noButton).setOnClickListener(view -> finish());
        findViewById(R.id.yesButton).setOnClickListener(view -> startImport());
    }

    @Override
    protected void onResume() {
        super.onResume();

        Uri data = getIntent().getData();

        if (data == null) {
            Toast.makeText(this, "Нет входных параметров для импорта", Toast.LENGTH_SHORT).show();
            finish();
        } else {
            ContentResolver cr = getApplicationContext().getContentResolver();
            String fileName = getContentName(cr, data);

            ((TextView)findViewById(R.id.fileName)).setText(fileName);
        }
    }

    private void startImport() {
        Uri data = getIntent().getData();
        final String scheme = data.getScheme();

        findViewById(R.id.confirm).setVisibility(View.GONE);
        findViewById(R.id.progressBar).setVisibility(View.VISIBLE);

        setTitle("Importing...");

        if (ContentResolver.SCHEME_CONTENT.equals(scheme)) {
            try {
                importData(data);

                Toast.makeText(this, "Файл успешно импортирован", Toast.LENGTH_SHORT).show();
            } catch (Exception e) {
                Log.e("File Import Error", e.getMessage());
                Toast.makeText(this, "Не удалось импортировать файл", Toast.LENGTH_SHORT).show();
            }
        } else {
            Toast.makeText(this, "Неправильная схема для импорта: " + scheme, Toast.LENGTH_SHORT).show();
        }

        finish();
    }

    private void importData(Uri data) throws FileNotFoundException, PackageManager.NameNotFoundException {
        ContentResolver cr = getApplicationContext().getContentResolver();
        InputStream is = cr.openInputStream(data);
        if (is == null) return;

        String name = getContentName(cr, data);

        PackageManager m = getPackageManager();
        String s = getPackageName();
        PackageInfo p = m.getPackageInfo(s, 0);
        s = p.applicationInfo.dataDir;

        InputStreamToFile(is, s + "/files/" + name);
    }

    private String getContentName(ContentResolver resolver, Uri uri) {
        Cursor cursor = resolver.query(uri, null, null, null, null);
        cursor.moveToFirst();
        int nameIndex = cursor.getColumnIndex(MediaStore.MediaColumns.DISPLAY_NAME);
        if (nameIndex >= 0) {
            return cursor.getString(nameIndex);
        } else {
            return null;
        }
    }

    private void InputStreamToFile(InputStream in, String file) {
        try {
            OutputStream out = new FileOutputStream(new File(file));

            int size = 0;
            byte[] buffer = new byte[1024];

            while ((size = in.read(buffer)) != -1) {
                out.write(buffer, 0, size);
            }

            out.close();
        } catch (Exception e) {
            Log.e("MainActivity", "InputStreamToFile exception: " + e.getMessage());
        }
    }
}
