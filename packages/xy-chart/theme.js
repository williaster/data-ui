export const unit = 8;

export const colors = {
  default: '#00A699',
  dark: '#00514A',
  light: '#84D2CB',

  disabled: '#484848',
  lightDisabled: '#DBDBDB',

  grid: '#DBDBDB',
  label: '#484848',
  tickLabel: '#767676',

  categories: [
    '#00A699', // aqua
    '#84D2CB', // light aqua
    '#FFB400', // yellow-orange
    '#7b0051', // purple
    '#FC642D', // red-orange
    '#FF5A5F', // coral
  ],
};

export const grid = {
  stroke: colors.grid,
  strokeWidth: 1,
};

export const fontFamily = 'BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif';

export const axis = {
  stroke: colors.grid,
  strokeWidth: 1,
  tickStroke: colors.grid,
  tickLength: 1 * unit,
  label: {
    textAnchor: 'middle',
    dy: '0.25em',
    fill: colors.tickLabel,
    fontFamily,
    fontSize: 14,
    fontWeight: 800,
  },
  xTickLabel: {
    textAnchor: 'middle',
    dy: '0.25em',
    fontFamily,
    fontSize: 14,
    fill: colors.tickLabel,
    fontWeight: 200,
  },
  yTickLabel: {
    textAnchor: 'start',
    dy: '0.25em',
    fontFamily,
    fontSize: 14,
    fill: colors.tickLabel,
    fontWeight: 200,
  },
};

export default {
  axis,
  colors,
  grid,
  unit,
};
