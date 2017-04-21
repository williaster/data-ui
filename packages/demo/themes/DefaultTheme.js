const unit = 8;

const color = {
  lightGray: '#F2F2F2',
  mediumGray: '#DBDBDB',
  darkGray: '#767676',
  black: '#474747',
  coral: '#D43242',
};

const getFont = ({ fontFamily, fontSize, letterSpacing = 0, lineHeight, padding }) => ({
  color: color.black,
  fontFamily,
  fontSize,
  letterSpacing,
  lineHeight: `${lineHeight}px`,
  paddingBottom: padding,
  paddingTop: padding,
});

const fontFamily = 'BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif';

export default {
  color,

  font: {
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
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.4,
      }),
    },
    small: {
      ...getFont({
        fontFamily,
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: 0.2,
      }),
    },
    regular: {
      ...getFont({
        fontFamily,
        fontSize: 18,
        lineHeight: 24,
        spacing: 0,
      }),
    },
    large: {
      ...getFont({
        fontFamily,
        fontSize: 22,
        lineHeight: 28,
        letterSpacing: -0.2,
      }),
    },
  },

  unit,
};
