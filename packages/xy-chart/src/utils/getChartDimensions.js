import { DEFAULT_CHART_MARGIN } from './chartUtils';

export default function getChartDimensions({ margin, width, height }) {
  const completeMargin = { ...DEFAULT_CHART_MARGIN, ...margin };

  return {
    margin: completeMargin,
    innerHeight: Math.max(0, height - completeMargin.top - completeMargin.bottom),
    innerWidth: Math.max(0, width - completeMargin.left - completeMargin.right),
  };
}
