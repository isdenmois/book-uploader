import React from 'react'
import { NavigationContext } from '@react-navigation/native'

export const mockNavigation = () => {
  const navContext = {
    isFocused: () => true,
    goBack: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  }

  const NavigationWrapper = ({ children }) => (
    <NavigationContext.Provider value={navContext as any}>{children}</NavigationContext.Provider>
  )

  return { navContext, NavigationWrapper }
}
