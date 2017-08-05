import PropTypes from 'prop-types';
import React from 'react';

import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

export const propTypes = {
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // all likely passed by the parent chart
  data: PropTypes.array,
  getX: PropTypes.func,
  getY: PropTypes.func,
  // @TODO width + height?
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export const defaultProps = {
  data: [],
  fill: '#008489',
  fillOpacity: 0.7,
  getX: null,
  getY: null,
  stroke: '#fff',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
};

function BarSeries({
  data,
  getX,
  getY,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale || !getX || !getY || !data.length) return null;
  const barWidth = Math.max(1, (Math.max(...xScale.range()) / data.length) - 1);
  const maxBarHeight = Math.max(...yScale.range());
  return (
    <Group>
      {data.map((d) => {
        const x = xScale(getX(d));
        const y = yScale(getY(d));
        return (
          <Bar
            key={`bar-${x}-${y}`}
            x={x - (barWidth / 2)}
            y={y}
            width={barWidth}
            height={maxBarHeight - y}
            fill={d.fill || fill}
            fillOpacity={typeof d.fillOpacity !== 'undefined' ? d.fillOpacity : fillOpacity}
            stroke={d.stroke || stroke}
            strokeWidth={d.strokeWidth || strokeWidth}
          />
        );
      })}
    </Group>
  );
}

BarSeries.propTypes = propTypes;
BarSeries.defaultProps = defaultProps;
BarSeries.displayName = 'BarSeries';

export default BarSeries;
