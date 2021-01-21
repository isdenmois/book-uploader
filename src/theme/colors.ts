import { DynamicValue, useDarkModeContext } from 'react-native-dynamic';

export const light = {
  background: '#F9FAFE',
  searchBackground: '#B8D5F9',
  uploadBackground: '#C2B9F9',
  profileBackground: '#FFAD99',
  tabsBackground: 'white',
  secondaryBackground: '#E0E0E0',
  progressBackground: '#DEE2ED',
  modalBackground: 'white',

  searchText: '#092D5D',
  uploadText: '#15085E',
  profileText: '#661400',
  tabText: '#121417',

  searchSelected: '#5396EE',
  uploadSelected: '#6851F0',
  profileSelected: '#FF6842',

  invertedText: 'white',
  secondary: '#787D87',
  search: '#8C93A3',
  input: 'white',
  deleteButton: '#9BA8CA',
  success: '#48B755',
  error: '#FD4463',
};

export const dark: Color = {
  background: '#1f1d2b',
  searchBackground: '#525298',
  uploadBackground: '#805da7',
  profileBackground: '#d95333',

  tabsBackground: '#212230',
  secondaryBackground: '#E0E0E0',
  progressBackground: '#DEE2ED',
  modalBackground: '#212230',

  searchText: '#fefefe',
  uploadText: '#fefefe',
  profileText: '#fefefe',
  tabText: '#7b7c89',

  searchSelected: '#525298',
  uploadSelected: '#9c4ec2',
  profileSelected: '#ff7128',

  invertedText: 'white',
  secondary: '#92949b',
  search: '#8C93A3',
  input: '#252836',
  deleteButton: '#9BA8CA',
  success: '#22b07d',
  error: '#d8125d',
};

type Color = typeof light;

export function getColor(mode): Color {
  return mode === 'dark' ? dark : light;
}

export const dynamicColor: Color = {} as any;
for (let name in dark) {
  dynamicColor[name] = new DynamicValue(light[name], dark[name]);
}

export function useSColor(ds) {
  const mode = useDarkModeContext();

  return { s: ds[mode], color: getColor(mode) };
}

export function useColor() {
  const mode = useDarkModeContext();

  return getColor(mode);
}
