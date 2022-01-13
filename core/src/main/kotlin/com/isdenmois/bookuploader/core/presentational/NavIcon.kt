package com.isdenmois.bookuploader.core.presentational

import android.util.Log
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Icon
import androidx.compose.material.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Search
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.tooling.preview.Devices
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.isdenmois.bookuploader.core.theme.AppTheme

@Composable
fun RowScope.NavIcon(
    selected: Boolean,
    item: NavItem,
    onClick: () -> Unit
) {
    Log.d("NavIcon", "render")

    Row(
        modifier = Modifier
            .weight(1f)
            .height(52.dp)
            .clickableOpacity(onClick = onClick, enabled = !selected),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center,
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .clip(RoundedCornerShape(16.dp))
                .background(if (selected) item.backgroundColor else Color.Transparent)
                .padding(horizontal = 16.dp, vertical = 4.dp)
                .animateContentSize()
        ) {
            Icon(
                imageVector = item.icon,
                contentDescription = "dummy",
                tint = item.textColor,
            )

            Spacer(modifier = Modifier.width(8.dp))
            if (selected) {
                Text(
                    text = if (selected) item.label else "",
                    color = item.textColor,
                )
            }
        }
    }
}

fun Modifier.clickableOpacity(enabled: Boolean = true, onClick: () -> Unit): Modifier = composed {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val backgroundAlpha = if (isPressed) 0.2f else 1f

    alpha(backgroundAlpha).then(
        clickable(indication = null, interactionSource = interactionSource, enabled = enabled, onClick = onClick)
    )
}

data class NavItem(
    val label: String,
    val icon: ImageVector,
    val backgroundColor: Color,
    val textColor: Color,
)

@Composable
fun NavBar(items: List<NavItem>, selected: Int, onChange: (Int) -> Unit) {
    Row(
        modifier = Modifier
            .height(52.dp)
            .shadow(4.dp)
            .background(AppTheme.colors.tabsBackground),
        verticalAlignment = Alignment.CenterVertically
    ) {
        items.forEachIndexed { index, navItem ->
            NavIcon(item = navItem, selected = selected == index, onClick = { onChange(index) })
        }
    }
}

@Preview(device = Devices.PIXEL_4)
@Composable
fun NavIconPreview() {
    val selected = remember { mutableStateOf(0) }
    val colors = AppTheme.colors
    val items = remember(colors) {
        listOf(
            NavItem("Upload", Icons.Outlined.Home, colors.uploadBackground, colors.uploadText),
            NavItem("Search", Icons.Outlined.Search, colors.searchBackground, colors.searchText),
            NavItem("Profile", Icons.Outlined.Person, colors.profileBackground, colors.profileText),
        )
    }

    AppTheme {
        NavBar(items = items, selected = selected.value, onChange = { selected.value = it })
    }
}
