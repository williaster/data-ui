import React from 'react';
import PropTypes from 'prop-types';

import Bar from '@vx/shape/build/shapes/Bar';
import Group from '@vx/group/build/Group';
import themeColors from '@data-ui/theme/build/color';

import { barSeriesDataShape } from '../utils/propShapes';
import { callOrValue, isDefined } from '../utils/chartUtils';

const propTypes = {
  data: barSeriesDataShape.isRequired,
  label: PropTypes.string.isRequired,

  // overridden by data props
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // probably injected by the parent xychart
  barWidth: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

const defaultProps = {
  barWidth: null,
  fill: themeColors.default,
  stackBy: null,
  stroke: '#FFFFFF',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
  onMouseMove: undefined,
  onMouseLeave: undefined,
};

const x = d => d.x;
const y = d => d.y;

export default class BarSeries extends React.PureComponent {
  render() {
    const {
      barWidth,
      data,
      fill,
      stroke,
      strokeWidth,
      label,
      xScale,
      yScale,
      onMouseMove,
      onMouseLeave,
    } = this.props;

    if (!xScale || !yScale || !barWidth) return null;

    const maxHeight = (yScale.range() || [0])[0];
    const offset = xScale.offset || 0;
    return (
      <Group key={label}>
        {data.map((d, i) => {
          const barHeight = maxHeight - yScale(y(d));
          const color = d.fill || callOrValue(fill, d, i);
          return isDefined(d.y) && (
            <Bar
              key={`bar-${label}-${xScale(x(d))}`}
              x={xScale(x(d)) - offset}
              y={maxHeight - barHeight}
              width={barWidth}
              height={barHeight}
              fill={color}
              stroke={d.stroke || callOrValue(stroke, d, i)}
              strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
              onMouseMove={onMouseMove && (() => (event) => {
                onMouseMove({ event, data, datum: d, color });
              })}
              onMouseLeave={onMouseLeave && (() => onMouseLeave)}
            />
          );
        })}
      </Group>
    );
  }
}

BarSeries.propTypes = propTypes;
BarSeries.defaultProps = defaultProps;
BarSeries.displayName = 'BarSeries';
