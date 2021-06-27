import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Box } from './theme'

export function Dialog({ children }) {
  const navigation = useNavigation()

  return (
    <View style={s.container}>
      <TouchableWithoutFeedback onPress={() => navigation.goBack()} testID='dialogOverlay'>
        <View style={s.overlay} />
      </TouchableWithoutFeedback>

      <Box style={s.content} backgroundColor='modalBackground'>
        {children}
      </Box>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: '#0007',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    borderRadius: 20,
    overflow: 'hidden',
    margin: 48,
  },
})
