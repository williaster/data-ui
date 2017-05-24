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
  scales: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }).isRequired,
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
  scales,
}) {
  const { x, y } = scales;
  const maxHeight = (y.range() || [0])[0];
  return (
    <Group key={label}>
      {data.map((d, i) => {
        const barHeight = maxHeight - y(d.y);
        return (
          <Bar
            key={`bar-${label}-${x(d.x)}`}
            x={x(d.x) - (x.bandwidth ? 0 : (0.5 * barWidth))}
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
