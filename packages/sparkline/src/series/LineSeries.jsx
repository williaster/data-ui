import PropTypes from 'prop-types';
import React from 'react';

import { curveCardinal, curveLinear, curveBasis, curveMonotoneX } from '@vx/curve';
import Group from '@vx/group/build/Group';
import LinePath from '@vx/shape/build/shapes/LinePath';
import AreaClosed from '@vx/shape/build/shapes/AreaClosed';
import color from '@data-ui/theme/build/color';

import defined from '../utils/defined';

export const propTypes = {
  curve: PropTypes.oneOf(['linear', 'cardinal', 'basis', 'monotoneX']),
  fill: PropTypes.string,
  fillOpacity: PropTypes.number,
  showArea: PropTypes.bool,
  showLine: PropTypes.bool,
  stroke: PropTypes.string,
  strokeDasharray: PropTypes.string,
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  strokeWidth: PropTypes.number,

  // all likely passed by the parent chart
  data: PropTypes.array,
  getX: PropTypes.func,
  getY: PropTypes.func,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export const defaultProps = {
  curve: 'cardinal',
  data: [],
  fill: color.default,
  fillOpacity: 0.3,
  getX: null,
  getY: null,
  showArea: false,
  showLine: true,
  stroke: color.default,
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
  monotoneX: curveMonotoneX,
};

function LineSeries({
  data,
  getX,
  getY,
  fill,
  fillOpacity,
  curve,
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
  const curveFunc = CURVE_LOOKUP[curve];
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
          curve={curveFunc}
          defined={d => defined(getY(d))}
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
          curve={curveFunc}
          glyph={null}
          defined={d => defined(getY(d))}
        />}
    </Group>
  );
}

LineSeries.propTypes = propTypes;
LineSeries.defaultProps = defaultProps;
LineSeries.displayName = 'LineSeries';

export default LineSeries;
