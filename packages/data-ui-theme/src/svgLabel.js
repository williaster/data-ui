import font from './svgFont';

export const baseLabel = {
  ...font.small,
  ...font.bold,
  ...font.middle,
};

export const baseTickLabel = {
  ...font.small,
  ...font.light,
  ...font.middle,
};

export const tickLabels = {
  top: {
    ...baseTickLabel,
    dy: '-0.25em',
  },
  right: {
    ...baseTickLabel,
    ...font.right,
    dx: '0.25em',
    dy: '0.25em',
  },
  bottom: {
    ...baseTickLabel,
    dy: '0.25em',
  },
  left: {
    ...baseTickLabel,
    ...font.left,
    dx: '-0.25em',
    dy: '0.25em',
  },
};

export default {
  baseLabel,
  baseTickLabel,
  tickLabels,
};
