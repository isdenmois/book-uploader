import React from 'react'
import { NavigationContext } from '@react-navigation/native'

export const mockNavigation = () => {
  const navContext: any = {
    isFocused: () => true,
    addListener: jest.fn(() => jest.fn()),
  }

  const NavigationWrapper = ({ children }) => (
    <NavigationContext.Provider value={navContext}>{children}</NavigationContext.Provider>
  )

  return { mockNavigation, NavigationWrapper }
}
