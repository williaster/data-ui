import PropTypes from 'prop-types';
import React from 'react';

import { curveCardinal, curveLinear, curveBasis, curveMonotoneX } from '@vx/curve';
import Group from '@vx/group/build/Group';
import LinePath from '@vx/shape/build/shapes/LinePath';
import AreaClosed from '@vx/shape/build/shapes/AreaClosed';
import color from '@data-ui/theme/build/color';

import defined from '../utils/defined';
import findClosestDatum from '../utils/findClosestDatum';

export const propTypes = {
  curve: PropTypes.oneOf(['linear', 'cardinal', 'basis', 'monotoneX']),
  fill: PropTypes.string,
  fillOpacity: PropTypes.number,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
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
  curve: 'monotoneX',
  data: [],
  fill: color.default,
  fillOpacity: 0.3,
  getX: null,
  getY: null,
  onMouseMove: null,
  onMouseLeave: null,
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

class LineSeries extends React.PureComponent {
  render() {
    const {
      curve,
      data,
      getX,
      getY,
      fill,
      fillOpacity,
      onMouseMove,
      onMouseLeave,
      showArea,
      showLine,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeLinecap,
      xScale,
      yScale,
    } = this.props;
    if (!xScale || !yScale || !getX || !getY || !data.length) return null;
    const curveFunc = CURVE_LOOKUP[curve];
    return (
      <Group
        onMouseMove={onMouseMove && ((event) => {
          const { datum, index } = findClosestDatum({ data, getX, event, xScale });
          onMouseMove({ event, data, datum, index, color: fill });
        })}
        onMouseLeave={onMouseLeave}
      >
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
}

LineSeries.propTypes = propTypes;
LineSeries.defaultProps = defaultProps;
LineSeries.displayName = 'LineSeries';

export default LineSeries;
