import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { Bar, BarStack } from '@vx/shape';

import { barSeriesDataShape } from '../utils/propShapes';
import { callOrValue, scaleTypeToScale } from '../utils/chartUtils';
import { colors } from '../theme';

const propTypes = {
  data: barSeriesDataShape.isRequired,
  label: PropTypes.string.isRequired,
  stack: PropTypes.arrayOf(PropTypes.string),
  stackFills: PropTypes.arrayOf(PropTypes.string),

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
  fill: colors.default,
  stackBy: null,
  stroke: '#FFFFFF',
  strokeWidth: 1,
};

const x = d => d.x;
const y = d => d.y;

export default function VerticalBarSeries({
  barWidth,
  data,
  fill,
  stack,
  stackFills,
  stroke,
  strokeWidth,
  label,
  xScale,
  yScale,
}) {
  const maxHeight = (yScale.range() || [0])[0];
  const offset = xScale.offset || 0;
  if (stack) {
    const zScale = scaleTypeToScale.ordinal({ range: stackFills, domain: stack });
    return (
      <BarStack
        data={data}
        keys={stack}
        height={maxHeight}
        x={x}
        xScale={xScale}
        yScale={yScale}
        zScale={zScale}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }
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

VerticalBarSeries.propTypes = propTypes;
VerticalBarSeries.defaultProps = defaultProps;
VerticalBarSeries.displayName = 'VerticalBarSeries';
