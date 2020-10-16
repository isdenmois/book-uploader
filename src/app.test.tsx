import { render } from '@testing-library/react-native';
import React from 'react';

import 'react-native-gesture-handler/jestSetup';
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

import * as addressContext from 'services/address';
import App from './app';

describe('App', () => {
  it('should render spinner while address is null', () => {
    jest.spyOn(addressContext, 'useCreateAddressContext').mockReturnValue({ address: null } as any);

    const { toJSON } = render(<App />);

    expect(toJSON().type).toBe('ActivityIndicator');
  });

  it('should render scan screen when address is not defined', () => {
    jest.spyOn(addressContext, 'useCreateAddressContext').mockReturnValue({ address: '' } as any);

    const data: any = render(<App />).toJSON();

    expect(data.type).toBe('NavigationContainer');
    expect(data.children[0].props.initialRouteName).toBe('scan');
  });

  it('should render home screen when address is defined', () => {
    jest.spyOn(addressContext, 'useCreateAddressContext').mockReturnValue({ address: '127.0.0.1' } as any);

    const data: any = render(<App />).toJSON();

    expect(data.type).toBe('NavigationContainer');
    expect(data.children[0].props.initialRouteName).toBe('home');
  });
});
