export const unit = 8;

export const colors = {
  default: '#00A699',
  dark: '#00514A',
  light: '#84D2CB',

  disabled: '#484848',
  lightDisabled: '#DBDBDB',

  grid: '#DBDBDB',
  gridDark: '#484848',
  label: '#767676',
  tickLabel: '#767676',

  categories: [
    '#00A699', // aqua
    '#84D2CB', // light aqua
    '#FFB400', // yellow-orange
    '#7b0051', // purple
    '#FC642D', // red-orange
    '#9BE382', // lime
    '#484848', // dark grey
    '#FFBAA0', // peach
    '#008C99', // dark aqua
  ],
};

export const gridStyles = {
  stroke: colors.grid,
  strokeWidth: 1,
};

export const fontFamily = 'BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif';

const baseLabel = {
  fill: colors.label,
  fontFamily,
  fontSize: 12,
  fontWeight: 700,
  textAnchor: 'middle',
};

export const xAxisStyles = {
  stroke: colors.gridDark,
  strokeWidth: 2,
  label: {
    bottom: {
      ...baseLabel,
    },
    top: {
      ...baseLabel,
    },
  },
};

export const yAxisStyles = {
  stroke: colors.grid,
  strokeWidth: 1,
  label: {
    left: {
      ...baseLabel,
    },
    right: {
      ...baseLabel,
    },
  },
};

const baseTickLabel = {
  fill: colors.tickLabel,
  fontFamily,
  fontSize: 12,
  fontWeight: 200,
};

export const xTickStyles = {
  stroke: colors.grid,
  length: 1 * unit,
  label: {
    bottom: {
      ...baseTickLabel,
      textAnchor: 'middle',
      dy: '0.25em',
    },
    top: {
      ...baseTickLabel,
      textAnchor: 'middle',
      dy: '-0.25em',
    },
  },
};

export const yTickStyles = {
  stroke: colors.grid,
  length: 1 * unit,
  label: {
    left: {
      ...baseTickLabel,
      textAnchor: 'end',
      dx: '-0.25em',
      dy: '0.25em',
    },
    right: {
      ...baseTickLabel,
      textAnchor: 'start',
      dx: '0.25em',
      dy: '0.25em',
    },
  },
};

export const labelStyles = {
  fill: colors.label,
  fontFamily,
  fontSize: 12,
  fontWeight: 200,
  dx: '0.5em',
  dy: '0.5em',
};

export default {
  colors,
  gridStyles,
  unit,
  xAxisStyles,
  xTickStyles,
  yAxisStyles,
  yTickStyles,
  labelStyles,
};
