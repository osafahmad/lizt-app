import {Dimensions} from 'react-native';

export type TTheme = 'light' | 'dark';
const {height} = Dimensions.get('screen');

export const fontSize = {
  small: height * 0.014,
  body: height * 0.016,
  normal: height * 0.018,
  large: height * 0.022,
  extra: height * 0.024,
};

export const colors = {
  light: {
    bottomTab: '#9D59FB',
    text: '#242424',
    background: '#FFF',
    button: '#9D59FB',
    transparent: '#9D59FB',
    buttonText: '#FFF',
    card: '#d3b4fd',
    active: '#9D59FB',
    inactive: '#646464',
    input: '#eae9ee',
    white: '#FFF',
  },
  dark: {
    bottomTab: '#c39afc',
    text: '#FFF',
    background: '#242424',
    button: '#610adb',
    buttonText: '#FFF',
    transparent: '#FFF',
    card: '#d3b4fd',
    active: '#610adb',
    inactive: '#CAC7C7',
    input: '#C9C8CA',
    white: '#FFF',
  },
};
