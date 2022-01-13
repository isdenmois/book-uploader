package com.isdenmois.bookuploader.upload.presentation

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.IconButton
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.isdenmois.bookuploader.core.presentational.focus.OnLifecycleResume
import com.isdenmois.bookuploader.core.theme.AppTheme
import com.isdenmois.bookuploader.upload.R
import com.isdenmois.bookuploader.upload.UploadListViewModel
import com.isdenmois.bookuploader.upload.presentation.ui.UploadList

@Composable
fun UploadTab(isActive: Boolean = false) {
    val vm: UploadListViewModel = viewModel()

    LaunchedEffect(isActive) {
        if (isActive) {
            vm.loadBookList()
        }
    }

    OnLifecycleResume {
        if (isActive) {
            vm.loadBookList()
        }
    }

    Column(modifier = Modifier.fillMaxWidth().padding(top = 16.dp)) {
        Row(modifier = Modifier.padding(horizontal = 0.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 16.dp)
            ) {
                val address = vm.address.value.replace("http://", "").takeWhile { it != ':' }
                Text("Upload", color = AppTheme.colors.uploadText, style = MaterialTheme.typography.h5)

                if (address.isNotBlank()) {
                    Text(address, color = AppTheme.colors.secondary, style = MaterialTheme.typography.caption)
                }
            }

            IconButton(onClick = { vm.scanQr() }, modifier = Modifier.padding(end = 5.dp)) {
            Image(painter = painterResource(id = R.drawable.ic_scan), contentDescription = "Scan")
        }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (vm.bookList.value == null) {
            Row(
                modifier = Modifier.fillMaxSize(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                CircularProgressIndicator(color = AppTheme.colors.uploadSelected)
            }
        }

        UploadList()
    }
}
