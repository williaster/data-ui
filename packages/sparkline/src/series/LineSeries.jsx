import PropTypes from 'prop-types';
import React from 'react';

import { curveCardinal, curveLinear, curveBasis } from '@vx/curve';
import { Group } from '@vx/group';
import { LinePath, AreaClosed } from '@vx/shape';

export const propTypes = {
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  interpolation: PropTypes.oneOf(['linear', 'cardinal', 'basis']),
  showArea: PropTypes.bool,
  showLine: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // all likely passed by the parent chart
  data: PropTypes.array,
  getX: PropTypes.func,
  getY: PropTypes.func,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export const defaultProps = {
  data: [],
  fill: '#008489',
  fillOpacity: 0.3,
  getX: null,
  getY: null,
  interpolation: 'cardinal',
  showArea: false,
  showLine: true,
  stroke: '#008489',
  strokeWidth: 2,
  strokeDasharray: null,
  strokeLinecap: 'round',
  xScale: null,
  yScale: null,
};

const CURVE_LOOKUP = {
  linear: curveLinear,
  basis: curveBasis,
  cardinal: curveCardinal,
};

function LineSeries({
  data,
  getX,
  getY,
  fill,
  fillOpacity,
  interpolation,
  showArea,
  showLine,
  stroke,
  strokeWidth,
  strokeDasharray,
  strokeLinecap,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale || !getX || !getY || !data.length) return null;
  const curve = CURVE_LOOKUP[interpolation];
  return (
    <Group>
      {showArea &&
        <AreaClosed
          data={data}
          x={getX}
          y={getY}
          xScale={xScale}
          yScale={yScale}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke="transparent"
          strokeWidth={strokeWidth}
          curve={curve}
        />}
      {showLine && strokeWidth > 0 &&
        <LinePath
          data={data}
          x={getX}
          y={getY}
          xScale={xScale}
          yScale={yScale}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap={strokeLinecap}
          curve={curve}
          glyph={null}
        />}
    </Group>
  );
}

LineSeries.propTypes = propTypes;
LineSeries.defaultProps = defaultProps;
LineSeries.displayName = 'LineSeries';

export default LineSeries;
