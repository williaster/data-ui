import PropTypes from 'prop-types';
import React from 'react';
import { mean, median, max, min } from 'd3-array';

import { Line } from '@vx/shape';
import { Point } from '@vx/point';

export const propTypes = {
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  reference: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([
      'mean',
      'median',
      'min',
      'max',
    ]),
  ]),

  // all likely passed by the parent chart
  data: PropTypes.array,
  getY: PropTypes.func,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export const defaultProps = {
  data: [],
  getY: null,
  reference: 'mean',
  stroke: '#008489',
  strokeDasharray: null,
  strokeLinecap: 'round',
  strokeWidth: 2,
  xScale: null,
  yScale: null,
};

function ReferenceLine({
  data,
  getY,
  reference,
  stroke,
  strokeDasharray,
  strokeLinecap,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale || !getY || !data.length) return null;
  const [x0, x1] = xScale.range();

  let y = reference;
  if (reference === 'mean') y = yScale(mean(data, getY));
  if (reference === 'median') y = yScale(median(data, getY));
  if (reference === 'max') y = yScale(max(data, getY));
  if (reference === 'min') y = yScale(min(data, getY));

  const fromPoint = new Point({ x: x0, y });
  const toPoint = new Point({ x: x1, y });
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

ReferenceLine.propTypes = propTypes;
ReferenceLine.defaultProps = defaultProps;
ReferenceLine.displayName = 'ReferenceLine';

export default ReferenceLine;
