import { defaultProps } from '../chart/XYChart';

export default function getChartDimensions(props) {
  const { margin, width, height } = props;
  const completeMargin = { ...defaultProps.margin, ...margin };
  return {
    margin: completeMargin,
    innerHeight: height - completeMargin.top - completeMargin.bottom,
    innerWidth: width - completeMargin.left - completeMargin.right,
  };
}
