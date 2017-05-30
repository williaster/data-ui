import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

import { intervalSeriesDataShape } from '../utils/propShapes';
import { callOrValue } from '../utils/chartUtils';
import { colors } from '../theme';

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
};

const defaultProps = {
  fill: colors.default,
  stroke: 'none',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
};

const x0 = d => d.x0;
const x1 = d => d.x1;

export default function IntervalSeries({
  data,
  fill,
  label,
  stroke,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale) return null;

  const barHeight = (yScale.range() || [0])[0];
  return (
    <Group key={label}>
      {data.map((d, i) => {
        const x = xScale(x0(d));
        const barWidth = xScale(x1(d)) - x;
        return (
          <Bar
            key={`interval-${label}-${x}`}
            x={x}
            y={0}
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

IntervalSeries.propTypes = propTypes;
IntervalSeries.defaultProps = defaultProps;
IntervalSeries.displayName = 'IntervalSeries';
