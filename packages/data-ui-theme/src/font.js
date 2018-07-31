import { textColor } from './color';

const getFont = ({ fontFamily, fontSize, letterSpacing = 0, lineHeight, padding }) => ({
  color: textColor,
  fontFamily,
  fontSize,
  letterSpacing,
  lineHeight: `${lineHeight}px`,
  paddingBottom: padding,
  paddingTop: padding,
});

const fontFamily = 'BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif';

export default {
  fontFamily,

  // weights
  light: {
    fontWeight: 200,
  },
  bold: {
    fontWeight: 700,
  },

  // size
  tiny: {
    ...getFont({
      fontFamily,
      fontSize: 10,
      lineHeight: 12,
      letterSpacing: 0.4,
    }),
  },
  small: {
    ...getFont({
      fontFamily,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    }),
  },
  regular: {
    ...getFont({
      fontFamily,
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0.2,
    }),
  },
  large: {
    ...getFont({
      fontFamily,
      fontSize: 18,
      lineHeight: 24,
      spacing: 0,
    }),
  },
};
