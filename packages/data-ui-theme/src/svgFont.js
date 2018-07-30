import { textColor } from './color';

const getSvgFont = ({ fontFamily, fontSize, letterSpacing }) => ({
  fill: textColor,
  stroke: 'none',
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
  start: {
    textAnchor: 'start',
  },
  middle: {
    textAnchor: 'middle',
  },
  end: {
    textAnchor: 'end',
  },

  // size
  tiny: {
    ...getSvgFont({
      fontFamily,
      fontSize: 10,
      letterSpacing: 0.4,
    }),
  },
  small: {
    ...getSvgFont({
      fontFamily,
      fontSize: 12,
      letterSpacing: 0.4,
    }),
  },
  regular: {
    ...getSvgFont({
      fontFamily,
      fontSize: 14,
      letterSpacing: 0.2,
    }),
  },
  large: {
    ...getSvgFont({
      fontFamily,
      fontSize: 18,
      spacing: 0,
    }),
  },
};
