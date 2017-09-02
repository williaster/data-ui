import PropTypes from 'prop-types';
import React from 'react';

import Line from '@vx/shape/build/shapes/Line';
import Point from '@vx/point/build/Point';

import color from '@data-ui/theme/build/color';

export const propTypes = {
  reference: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  strokeDasharray: PropTypes.string,
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  strokeWidth: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

const defaultProps = {
  stroke: color.darkGray,
  strokeDasharray: null,
  strokeLinecap: 'round',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
};

function HorizontalReferenceLine({
  reference,
  stroke,
  strokeDasharray,
  strokeLinecap,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale) return null;
  const [x0, x1] = xScale.range();
  const scaledRef = yScale(reference);
  const fromPoint = new Point({ x: x0, y: scaledRef });
  const toPoint = new Point({ x: x1, y: scaledRef });
  return (
    <Line
      from={fromPoint}
      to={toPoint}
      stroke={stroke}
      strokeDasharray={strokeDasharray}
      strokeLinecap={strokeLinecap}
      strokeWidth={strokeWidth}
      vectorEffect="non-scaling-stroke"
    />
  );
}

HorizontalReferenceLine.propTypes = propTypes;
HorizontalReferenceLine.defaultProps = defaultProps;
HorizontalReferenceLine.displayName = 'HorizontalReferenceLine';

export default HorizontalReferenceLine;
