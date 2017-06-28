const getFont = ({
  fontFamily,
  fontSize,
  letterSpacing,
}) => ({
  color: '#222222',
  fontFamily,
  fontSize,
  letterSpacing,
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

  // alignment
  left: {
    textAnchor: 'start',
  },
  middle: {
    textAnchor: 'middle',
  },
  right: {
    textAnchor: 'end',
  },

  // size
  tiny: {
    ...getFont({
      fontFamily,
      fontSize: 10,
      letterSpacing: 0.4,
    }),
  },
  small: {
    ...getFont({
      fontFamily,
      fontSize: 12,
      letterSpacing: 0.4,
    }),
  },
  regular: {
    ...getFont({
      fontFamily,
      fontSize: 14,
      letterSpacing: 0.2,
    }),
  },
  large: {
    ...getFont({
      fontFamily,
      fontSize: 18,
      spacing: 0,
    }),
  },
};
