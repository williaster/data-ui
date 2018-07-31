import color from './color';
import font from './font';
import { tickLabels, baseLabel } from './svgLabel';
import { unit } from './size';

export const colors = color;

export const labelStyles = {
  ...baseLabel,
  ...font.light,
};

export const gridStyles = {
  stroke: colors.grid,
  strokeWidth: 1,
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

export const xTickStyles = {
  stroke: colors.grid,
  length: Number(unit),
  label: {
    bottom: {
      ...tickLabels.bottom,
    },
    top: {
      ...tickLabels.top,
    },
  },
};

export const yTickStyles = {
  stroke: colors.grid,
  length: Number(unit),
  label: {
    left: {
      ...tickLabels.left,
    },
    right: {
      ...tickLabels.right,
    },
  },
};

export default {
  colors,
  labelStyles,
  gridStyles,
  xAxisStyles,
  xTickStyles,
  yAxisStyles,
  yTickStyles,
};
