import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

import { barSeriesDataShape } from '../utils/propShapes';
import { callOrValue } from '../utils/chartUtils';
import { colors } from '../theme';

const propTypes = {
  data: barSeriesDataShape.isRequired,
  label: PropTypes.string.isRequired,

  // overridden by data props
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // these will likely be injected by the parent xychart
  barWidth: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
};

const defaultProps = {
  stack: null,
  stackFills: colors.categories,
  group: null,
  groupFills: colors.categories,

  fill: colors.default,
  stackBy: null,
  stroke: '#FFFFFF',
  strokeWidth: 1,
};

const x = d => d.x;
const y = d => d.y;

export default function BarSeries({
  barWidth,
  data,
  fill,
  stroke,
  strokeWidth,
  label,
  xScale,
  yScale,
}) {
  const maxHeight = (yScale.range() || [0])[0];
  const offset = xScale.offset || 0;
  return (
    <Group key={label}>
      {data.map((d, i) => {
        const barHeight = maxHeight - yScale(y(d));
        return (
          <Bar
            key={`bar-${label}-${xScale(x(d))}`}
            x={xScale(x(d)) - offset}
            y={maxHeight - barHeight}
            width={barWidth}
            height={barHeight}
            fill={d.fill || callOrValue(fill, d, i)}
            stroke={d.stroke || callOrValue(stroke, d, i)}
            strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
          />
        );
      })}
    </Group>
  );
}

BarSeries.propTypes = propTypes;
BarSeries.defaultProps = defaultProps;
BarSeries.displayName = 'BarSeries';
