import { render } from '@testing-library/react-native';
import React from 'react';

import 'react-native-gesture-handler/jestSetup';
jest.mock('@react-native-community/async-storage', () => ({ getItem: () => null }));
jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator({ children, ...props }) {
      const Element: any = 'Navigator';

      return <Element {...props}>{children}</Element>;
    },
    Screen(props) {
      const Element: any = 'Screen';

      return <Element {...props} />;
    },
  }),
}));
jest.mock('@react-navigation/native', () => ({
  NavigationContainer({ children, ...props }) {
    const Element: any = 'NavigationContainer';

    return <Element {...props}>{children}</Element>;
  },
}));
jest.mock('@react-native-community/async-storage', () => ({}));
jest.mock('react-native-fs', () => ({}));

import App from './app';

test('App', () => {
  const { toJSON } = render(<App />);

  expect(toJSON()).toMatchSnapshot();
});
