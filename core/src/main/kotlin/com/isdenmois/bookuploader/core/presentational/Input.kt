package com.isdenmois.bookuploader.core.presentational

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.selection.LocalTextSelectionColors
import androidx.compose.foundation.text.selection.TextSelectionColors
import androidx.compose.material.Icon
import androidx.compose.material.IconButton
import androidx.compose.material.LocalTextStyle
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.isdenmois.bookuploader.core.R
import com.isdenmois.bookuploader.core.theme.AppTheme

@Composable
fun Input(
    value: String,
    onValueChange: (String) -> Unit,
    enabled: Boolean = true,
    textColor: Color,
    placeholder: String? = null,
    icon: @Composable (() -> Unit)? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions(),
    focusRequester: FocusRequester = remember { FocusRequester() },
    visualTransformation: VisualTransformation = VisualTransformation.None,
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        elevation = 4.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        val customTextSelectionColors = remember {
            TextSelectionColors(
                handleColor = textColor,
                backgroundColor = textColor.copy(alpha = 0.4f)
            )
        }

        CompositionLocalProvider(LocalTextSelectionColors provides customTextSelectionColors) {
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                enabled = enabled,
                singleLine = true,
                maxLines = 1,
                keyboardOptions = keyboardOptions,
                keyboardActions = keyboardActions,
                cursorBrush = SolidColor(textColor),
                textStyle = LocalTextStyle.current.merge(TextStyle(color = textColor)),
                visualTransformation = visualTransformation,
                decorationBox = { innerTextField ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .height(44.dp)
                            .background(AppTheme.colors.input),
                    ) {
                        if (icon != null) {
                            Box(modifier = Modifier.padding(horizontal = 12.dp)) { icon() }
                        }

                        Box(Modifier.weight(1f)) {
                            if (value.isEmpty() && placeholder != null) Text(
                                text = placeholder,
                                style = LocalTextStyle.current.copy(
                                    color = AppTheme.colors.secondary,
                                )
                            )
                            innerTextField()
                        }

                        if (value.isNotEmpty() && enabled) {
                            IconButton(onClick = {
                                onValueChange("")
                                focusRequester.requestFocus()
                            }) {
                                Icon(
                                    Icons.Filled.Clear,
                                    "",
                                    tint = AppTheme.colors.deleteButton,
                                    modifier = Modifier.size(28.dp)
                                )
                            }
                        }
                    }
                },
                modifier = Modifier.focusRequester(focusRequester),
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun InputPreview() {
    AppTheme {
        Column(modifier = Modifier.padding(16.dp)) {
            Input(
                value = "test",
                onValueChange = { },
                icon = {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_search),
                        contentDescription = "",
                        tint = AppTheme.colors.search
                    )
                },
                textColor = AppTheme.colors.searchText
            )
        }
    }
}
