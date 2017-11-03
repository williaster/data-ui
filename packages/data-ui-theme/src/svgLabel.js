import font from './svgFont';

export const baseLabel = {
  ...font.small,
  ...font.bold,
  ...font.middle,
  pointerEvents: 'none',
};

export const labelTiny = {
  ...font.tiny,
  ...font.bold,
  ...font.middle,
  pointerEvents: 'none',
};

export const baseTickLabel = {
  ...font.small,
  ...font.light,
  ...font.middle,
  pointerEvents: 'none',
};

export const tickLabels = {
  top: {
    ...baseTickLabel,
    dy: '-0.25em',
  },
  right: {
    ...baseTickLabel,
    ...font.start,
    dx: '0.25em',
    dy: '0.25em',
  },
  bottom: {
    ...baseTickLabel,
    dy: '0.25em',
  },
  left: {
    ...baseTickLabel,
    ...font.end,
    dx: '-0.25em',
    dy: '0.25em',
  },
};

export default {
  baseLabel,
  baseTickLabel,
  tickLabels,
};
