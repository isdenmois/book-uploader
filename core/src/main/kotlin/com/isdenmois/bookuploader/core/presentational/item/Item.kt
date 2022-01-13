package com.isdenmois.bookuploader.core.presentational.item

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.Icon
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.isdenmois.bookuploader.core.theme.AppTheme

@Composable
fun Item(
    onClick: () -> Unit = {},
    disabled: Boolean = false,
    progress: @Composable () -> Unit = {},
    content: @Composable RowScope.() -> Unit
) {
    Column(
        modifier = Modifier
            .defaultMinSize(0.dp, 48.dp)
            .clickable(!disabled) { onClick() }
            .padding(start = 16.dp, top = 6.dp, end = 5.dp, bottom = 6.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth(),
        ) {
            content()
        }

        Column(modifier = Modifier.padding(end = 11.dp)) {
            progress()
        }
    }
}

@Composable
fun RowScope.ItemText(
    title: String,
    supTitle: String? = null,
    subTitle: String? = null,
    error: String? = null,
    color: Color = AppTheme.colors.searchText
) {
    Spacer(modifier = Modifier.width(8.dp))

    Column(modifier = Modifier.weight(1f)) {
        if (supTitle !== null && error === null) {
            Text(
                supTitle,
                style = MaterialTheme.typography.caption,
                color = AppTheme.colors.secondary
            )
        }

        Text(title, color = color, style = MaterialTheme.typography.body1)

        if (subTitle !== null && subTitle.isNotEmpty() && error === null) {
            Text(
                subTitle,
                style = MaterialTheme.typography.caption,
                color = AppTheme.colors.secondary,
                maxLines = 1,
            )
        }

        if (error !== null) {
            Text(error, style = MaterialTheme.typography.caption, color = AppTheme.colors.error)
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun ItemPreview() {
    AppTheme {
        Column {
            Item {
                Icon(Icons.Default.Phone, "")
                ItemText(title = "anna-karenina.fb2", subTitle = "740KB")
            }

            Spacer(modifier = Modifier.height(8.dp))

            Item {
                Icon(Icons.Filled.Person, "")
                ItemText(title = "Anna Karenina", supTitle = "Lev Tolstoy")
            }

            Spacer(modifier = Modifier.height(8.dp))

            Item {
                Icon(Icons.Default.CheckCircle, "")
                ItemText(
                    title = "Anna Karenina",
                    supTitle = "Lev Tolstoy",
                    error = "Unable to upload"
                )
            }
        }
    }
}
