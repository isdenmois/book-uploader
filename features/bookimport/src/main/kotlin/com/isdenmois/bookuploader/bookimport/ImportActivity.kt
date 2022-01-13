package com.isdenmois.bookuploader.bookimport

import android.content.ContentResolver
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.isdenmois.bookuploader.core.theme.AppTheme
import dagger.hilt.android.AndroidEntryPoint
import java.io.File

@AndroidEntryPoint
class ImportActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val label = getContentName(intent.data)

        setContent {
            AppTheme {
                Surface(color = AppTheme.colors.background) {
                    if (label !== null) {
                        ImportDialog(label = label)
                    }
                }
            }
        }
        reportFullyDrawn()
    }

    override fun onResume() {
        super.onResume()

        val data = intent.data

        if (data == null) {
            Toast.makeText(this, R.string.empty_data, Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    private fun startImport() {
        title = getString(R.string.import_in_progress)
        inProgress.value = true

        if (intent.data?.scheme == ContentResolver.SCHEME_CONTENT) {
            try {
                importData()
                Toast.makeText(this, R.string.file_import_success, Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                Log.e("File Import Error", "${e.message}")
                Toast.makeText(this, R.string.file_import_error, Toast.LENGTH_SHORT).show()
            }
        } else {
            val error = getString(R.string.file_import_wrong_schema, intent.data?.scheme)

            Toast.makeText(this, error, Toast.LENGTH_SHORT).show()
        }

        finish()
    }

    private fun importData() {
        val uri = intent.data!!
        val file = File(cacheDir, getContentName(uri) ?: return)
        val inputStream = applicationContext.contentResolver.openInputStream(uri) ?: return

        inputStream.copyTo(file.outputStream())
    }

    private fun getContentName(uri: Uri?): String? {
        if (uri === null) return null

        val resolver = applicationContext.contentResolver
        val cursor = resolver.query(uri, null, null, null, null)

        cursor?.use {
            cursor.moveToFirst()
            val nameIndex: Int = cursor.getColumnIndex(MediaStore.MediaColumns.DISPLAY_NAME)

            if (nameIndex >= 0) {
                return cursor.getString(nameIndex)
            }
        }

        return null
    }

    private val inProgress = mutableStateOf(false)

    @Composable
    private fun ImportDialog(label: String) {
        Column(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            if (!inProgress.value) {
                Text(
                    getString(R.string.import_dialog_title),
                    color = AppTheme.colors.uploadText,
                    style = MaterialTheme.typography.h6,
                    textAlign = TextAlign.Center,
                )
                Text(
                    label,
                    color = AppTheme.colors.uploadText,
                    style = MaterialTheme.typography.caption,
                    textAlign = TextAlign.Center,
                )

                Spacer(modifier = Modifier.height(24.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    Button(
                        onClick = { finish() },
                        colors = ButtonDefaults.outlinedButtonColors(backgroundColor = AppTheme.colors.background)
                    ) {
                        Text(getString(R.string.no), color = AppTheme.colors.secondary)
                    }

                    Spacer(modifier = Modifier.width(16.dp))

                    Button(
                        onClick = { startImport() },
                        colors = ButtonDefaults.outlinedButtonColors(backgroundColor = AppTheme.colors.background)
                    ) {
                        Text(getString(R.string.yes), color = AppTheme.colors.success)
                    }
                }
            } else {
                CircularProgressIndicator(color = AppTheme.colors.uploadSelected)
            }
        }
    }
}
