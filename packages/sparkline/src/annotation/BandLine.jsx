import PropTypes from 'prop-types';
import React from 'react';
import { quantile } from 'd3-array';

import { Bar } from '@vx/shape';

export const propTypes = {
  band: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.oneOf(['midspread']),
  ]),
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // all likely passed by the parent chart
  data: PropTypes.array,
  getY: PropTypes.func,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export const defaultProps = {
  data: [],
  getY: null,
  band: 'midspread',
  fill: '#ccc',
  fillOpacity: 0.5,
  stroke: 'transparent',
  strokeWidth: 0,
  xScale: null,
  yScale: null,
};

function BandLine({
  band,
  data,
  fill,
  fillOpacity,
  getY,
  stroke,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale || !getY || !data.length) return null;

  const [x0, x1] = xScale.range();

  let bandExtent = band;
  if (band === 'midspread') { // @TODO check bugginess upon animating
    const sortedData = [...data].sort((a, b) => parseFloat(getY(a)) - parseFloat(getY(b)));
    bandExtent = [
      quantile(sortedData, 0.25, getY),
      quantile(sortedData, 0.75, getY),
    ];
  }

  if (bandExtent.length !== 2) {
    console.warn('Expected band of two numbers'); // @TODO add with PropTypes
    return null;
  }

  const y0 = yScale(bandExtent[0]);
  const y1 = yScale(bandExtent[1]);

  return (
    <Bar
      x={0}
      y={Math.min(y0, y1)}
      width={x1 - x0}
      height={Math.abs(y1 - y0)}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

BandLine.propTypes = propTypes;
BandLine.defaultProps = defaultProps;
BandLine.displayName = 'BandLine';

export default BandLine;
