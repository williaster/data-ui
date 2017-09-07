import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { color } from '@data-ui/theme';

import { intervalSeriesDataShape } from '../utils/propShapes';
import { callOrValue } from '../utils/chartUtils';

const propTypes = {
  data: intervalSeriesDataShape.isRequired,
  label: PropTypes.string.isRequired,

  // overridden by data props
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // likely be injected by the parent xychart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

const defaultProps = {
  fill: color.default,
  stroke: 'none',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
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
      label,
      stroke,
      strokeWidth,
      xScale,
      yScale,
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
              stroke={d.stroke || callOrValue(stroke, d, i)}
              strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
              onMouseMove={onMouseMove && (() => (event) => {
                onMouseMove({ event, datum: d, data, color: intervalFill });
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
