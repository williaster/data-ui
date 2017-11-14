import React from 'react';
import PropTypes from 'prop-types';

import Group from '@vx/group/build/Group';
import Bar from '@vx/shape/build/shapes/Bar';
import color from '@data-ui/theme/build/color';

import { intervalSeriesDataShape } from '../utils/propShapes';
import { callOrValue } from '../utils/chartUtils';

const propTypes = {
  data: intervalSeriesDataShape.isRequired,
  label: PropTypes.string.isRequired,

  // overridden by data props
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.number,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  onClick: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,

  // likely be injected by the parent xychart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

const defaultProps = {
  fill: color.default,
  fillOpacity: 1,
  stroke: 'none',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
  onClick: null,
  onMouseMove: null,
  onMouseLeave: null,
};

const x0 = d => d.x0;
const x1 = d => d.x1;

export default class IntervalSeries extends React.PureComponent {
  render() {
    const {
      data,
      fill,
      fillOpacity,
      label,
      stroke,
      strokeWidth,
      xScale,
      yScale,
      onClick,
      onMouseMove,
      onMouseLeave,
    } = this.props;
    if (!xScale || !yScale) return null;

    const barHeight = (yScale.range() || [0])[0];
    return (
      <Group key={label}>
        {data.map((d, i) => {
          const x = xScale(x0(d));
          const barWidth = xScale(x1(d)) - x;
          const intervalFill = d.fill || callOrValue(fill, d, i);
          return (
            <Bar
              key={`interval-${label}-${x}`}
              x={x}
              y={0}
              width={barWidth}
              height={barHeight}
              fill={intervalFill}
              fillOpacity={fillOpacity}
              stroke={d.stroke || callOrValue(stroke, d, i)}
              strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
              onClick={onClick && (() => (event) => {
                onClick({ event, datum: d, index: i, data, color: intervalFill });
              })}
              onMouseMove={onMouseMove && (() => (event) => {
                onMouseMove({ event, datum: d, index: i, data, color: intervalFill });
              })}
              onMouseLeave={onMouseLeave && (() => onMouseLeave)}
            />
          );
        })}
      </Group>
    );
  }
}

IntervalSeries.propTypes = propTypes;
IntervalSeries.defaultProps = defaultProps;
IntervalSeries.displayName = 'IntervalSeries';
