import PropTypes from 'prop-types';
import React from 'react';

import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

import callOrValue from '../utils/callOrValue';

const propTypes = {
  binnedData: PropTypes.array,
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  valueKey: PropTypes.string,

  // likely injected by parent Histogram
  binScale: PropTypes.func,
  valueScale: PropTypes.func,
  // renderLabel: PropTypes.func,
};

const defaultProps = {
  binnedData: [],
  fill: '#008489',
  stroke: '#FFFFFF',
  strokeWidth: 1,
  binScale: null,
  valueScale: null,
  valueKey: 'count',
  fillOpacity: 0.7,
};

function BarSeries({
  binnedData,
  binScale,
  valueScale,
  valueKey,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
}) {
  if (!binScale || !valueScale || !binnedData || binnedData.length === 0) return null;

  const maxHeight = (valueScale.range() || [0])[0];

  return (
    <Group>
      {binnedData.map((d, i) => {
        const barHeight = maxHeight - valueScale(d[valueKey]);
        const x = binScale(d.bin || d.bin0);
        const barWidth = binScale.bandwidth
          ? binScale.bandwidth()
          : binScale(d.bin1) - binScale(d.bin0) - 1;

        return (
          <Bar
            key={`bar-${x}`}
            x={x}
            y={maxHeight - barHeight}
            width={barWidth}
            height={barHeight}
            fill={d.fill || callOrValue(fill, d, i)}
            fillOpacity={
              typeof fillOpacity !== 'undefined' ? fillOpacity : callOrValue(fillOpacity, d, i)
            }
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

export default BarSeries;
