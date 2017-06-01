import PropTypes from 'prop-types';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import { css, withStyles, ThemeProvider } from 'react-with-styles';

import DefaultTheme from './DefaultTheme';

ThemedStyleSheet.registerDefaultTheme(DefaultTheme);
ThemedStyleSheet.registerInterface(aphroditeInterface);

const withStylesPropTypes = {
  styles: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export {
  css,
  ThemedStyleSheet,
  ThemeProvider,
  withStyles,
  withStylesPropTypes,
};
