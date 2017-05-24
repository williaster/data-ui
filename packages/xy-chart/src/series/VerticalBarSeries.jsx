import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

import { callOrValue } from '../utils/chartUtils';
import { barSeriesDataShape } from '../utils/propShapes';

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
  fill: '#00A699',
  stroke: '#FFFFFF',
  strokeWidth: 1,
};

export default function VerticalBarSeries({
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
  const offset = xScale.bandwidth ? 0 : (xScale.range() || [0])[0];
  debugger;
  return (
    <Group key={label}>
      {data.map((d, i) => {
        const barHeight = maxHeight - yScale(d.y);
        return (
          <Bar
            key={`bar-${label}-${xScale(d.x)}`}
            x={xScale(d.x) - offset}
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

VerticalBarSeries.propTypes = propTypes;
VerticalBarSeries.defaultProps = defaultProps;
VerticalBarSeries.displayName = 'VerticalBarSeries';
