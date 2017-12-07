import { defaultProps } from '../chart/XYChart';

export default function getChartDimensions({ margin, width, height }) {
  const completeMargin = { ...defaultProps.margin, ...margin };
  return {
    margin: completeMargin,
    innerHeight: Math.max(0, height - completeMargin.top - completeMargin.bottom),
    innerWidth: Math.max(0, width - completeMargin.left - completeMargin.right),
  };
}
